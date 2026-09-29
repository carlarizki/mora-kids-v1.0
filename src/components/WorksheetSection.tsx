/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Download,
  Pencil,
  Eraser,
  Undo2,
  RotateCcw,
  Save,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
// eslint-disable-next-line import/no-unresolved
// Unminified build: the minified worker embeds a literal ESC control byte
// (used to strip malformed text-stream escapes) that some hosting/preview
// environments refuse to serve as a text asset.
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { MoraButton, MoraSectionHeader } from './ui/MoraPrimitives';
import { WORKSHEETS_CATALOG, WorksheetItem } from '../data/worksheets';
import { Language } from '../types/game';
import { sound } from '../utils/audio';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface WorksheetSectionProps {
  language: Language;
}

type Stroke = { color: string; size: number; points: { x: number; y: number }[] };

const PEN_COLORS = ['#2D2A26', '#FF7A59', '#4C8DFF', '#2FB380', '#FFC24C'];
const RENDER_SCALE = 2; // crisp enough to draw on, without rendering huge bitmaps
const REFERENCE_WIDTH = 1600; // pen/eraser sizes are tuned for a page rendered around this width

export const WorksheetSection: React.FC<WorksheetSectionProps> = ({ language }) => {
  const [activeSheet, setActiveSheet] = useState<WorksheetItem | null>(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [penColor, setPenColor] = useState(PEN_COLORS[0]);
  const [isErasing, setIsErasing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const pageBitmapCache = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const strokesByPage = useRef<Map<number, Stroke[]>>(new Map());
  const drawingRef = useRef<Stroke | null>(null);

  const drawStrokes = (ctx: CanvasRenderingContext2D, page: number) => {
    const strokes = strokesByPage.current.get(page) || [];
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  };

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const bg = pageBitmapCache.current.get(currentPage);
    if (!canvas || !bg) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0);
    drawStrokes(ctx, currentPage);
  }, [currentPage]);

  // Render (and cache) the real PDF page onto an offscreen canvas, then show it
  const showPage = useCallback(async (pageNum: number) => {
    const pdf = pdfDocRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas) return;
    setIsLoading(true);
    try {
      let bg = pageBitmapCache.current.get(pageNum);
      if (!bg) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: RENDER_SCALE });
        const off = document.createElement('canvas');
        off.width = viewport.width;
        off.height = viewport.height;
        const offCtx = off.getContext('2d');
        if (!offCtx) throw new Error('no 2d context');
        await page.render({ canvasContext: offCtx, viewport, canvas: off }).promise;
        pageBitmapCache.current.set(pageNum, off);
        bg = off;
      }
      canvas.width = bg.width;
      canvas.height = bg.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(bg, 0, 0);
      drawStrokes(ctx, pageNum);
      setLoadError(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('worksheet page render failed', err);
      setLoadError(
        language === 'id' ? 'Gagal memuat halaman worksheet.' : 'Failed to load this worksheet page.'
      );
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Load the PDF fresh every time a worksheet is opened
  useEffect(() => {
    if (!activeSheet) return;
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    strokesByPage.current = new Map();
    pageBitmapCache.current = new Map();
    pdfDocRef.current = null;
    setCurrentPage(1);

    pdfjsLib
      .getDocument({ url: activeSheet.pdfUrl })
      .promise.then((pdf) => {
        if (cancelled) return;
        pdfDocRef.current = pdf;
        setPageCount(pdf.numPages);
        showPage(1);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(language === 'id' ? 'Gagal memuat worksheet.' : 'Failed to load the worksheet.');
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSheet]);

  // Re-render when the visible page changes (after the doc is already loaded)
  useEffect(() => {
    if (activeSheet && pdfDocRef.current) {
      showPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const penSize = () => {
    const canvas = canvasRef.current;
    const factor = canvas ? canvas.width / REFERENCE_WIDTH : 1;
    return (isErasing ? 48 : 9) * factor;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    const stroke: Stroke = {
      color: isErasing ? '#FFFFFF' : penColor,
      size: penSize(),
      points: [getPos(e)],
    };
    drawingRef.current = stroke;
    const list = strokesByPage.current.get(currentPage) || [];
    list.push(stroke);
    strokesByPage.current.set(currentPage, list);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current.points.push(getPos(e));
    redraw();
  };

  const handlePointerUp = () => {
    drawingRef.current = null;
  };

  const handleUndo = () => {
    const list = strokesByPage.current.get(currentPage) || [];
    list.pop();
    strokesByPage.current.set(currentPage, list);
    redraw();
    sound.playPop();
  };

  const handleClear = () => {
    strokesByPage.current.set(currentPage, []);
    redraw();
    sound.playPop();
  };

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !activeSheet) return;
    const link = document.createElement('a');
    link.download = `${activeSheet.id}-halaman-${currentPage}-coretan.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    sound.playSuccess();
  };

  const goToPage = (delta: number) => {
    setCurrentPage((p) => Math.min(Math.max(1, p + delta), pageCount));
    sound.playPop();
  };

  return (
    <section id="worksheet" className="py-16 sm:py-24 bg-muted/40">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <MoraSectionHeader
          eyebrow={language === 'id' ? 'Aktivitas Luar Layar' : 'Offscreen Activities'}
          subtitle={
            language === 'id'
              ? 'Unduh worksheet untuk dicetak, atau kerjakan langsung di sini — coret-coret bareng si kecil tanpa perlu printer.'
              : 'Download to print, or work on it right here — no printer needed.'
          }
        >
          {language === 'id' ? 'Worksheet & Modul Aktivitas' : 'Worksheets & Activity Modules'}
        </MoraSectionHeader>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 items-start">
          {WORKSHEETS_CATALOG.map((sheet) => (
            <div
              key={sheet.id}
              className="paper-card rounded-2xl p-6 sm:p-7 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="size-12 rounded-xl bg-sky-soft text-primary flex items-center justify-center">
                  <FileText className="size-5" />
                </div>
                <span className="text-xs font-bold text-ink-soft bg-muted px-2.5 py-1 rounded-full whitespace-nowrap">
                  {sheet.ageGroup}
                </span>
              </div>

              <h3 className="mt-4 font-display text-lg sm:text-xl font-black text-foreground leading-tight">
                {sheet.title}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">{sheet.tagline}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {sheet.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-mint-soft text-mint"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <ul className="mt-4 space-y-1.5 text-xs text-foreground">
                {sheet.activities.slice(0, 3).map((a) => (
                  <li key={a.title} className="flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    <span>{a.title}</span>
                  </li>
                ))}
                <li className="text-ink-soft">
                  {language === 'id'
                    ? `+${sheet.activities.length - 3} aktivitas lainnya`
                    : `+${sheet.activities.length - 3} more`}
                </li>
              </ul>

              <div className="mt-5 pt-4 border-t border-border flex flex-col sm:flex-row gap-2.5">
                <a href={sheet.pdfUrl} download={sheet.pdfFileName} onClick={() => sound.playPop()} className="w-full">
                  <MoraButton variant="secondary" size="sm" className="w-full">
                    <Download className="size-4" />
                    <span>{language === 'id' ? 'Unduh PDF' : 'Download PDF'}</span>
                  </MoraButton>
                </a>
                <MoraButton
                  variant="joyful"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    sound.playPop();
                    setActiveSheet(sheet);
                  }}
                >
                  <Pencil className="size-4" />
                  <span>{language === 'id' ? 'Kerjakan di Sini' : 'Do it here'}</span>
                </MoraButton>
              </div>

              <p className="mt-3 text-[11px] text-ink-soft text-center sm:text-left">
                {sheet.pageCount} {language === 'id' ? 'halaman · Cetak A4' : 'pages · Print A4'}
              </p>
            </div>
          ))}

          {/* Full activity list, mirrors the printed worksheet's table of contents */}
          <div className="paper-card rounded-2xl p-6 sm:p-7">
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-ink-soft">
              {language === 'id' ? 'Isi worksheet ini' : "What's inside"}
            </h4>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2">
              {WORKSHEETS_CATALOG[0].activities.map((a, idx) => (
                <li key={a.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-sun/20 text-xs font-black text-sun-foreground">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-tight">{a.title}</p>
                    <p className="text-xs text-ink-soft mt-0.5">{a.category}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* PDF reader + annotate modal */}
      {activeSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-foreground/50 backdrop-blur-xs animate-in fade-in">
          <div className="paper-card rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-play border border-border">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border bg-card">
              <div className="flex items-center gap-1.5 mr-2">
                {PEN_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setIsErasing(false);
                      setPenColor(c);
                    }}
                    className={`size-7 rounded-full border-2 cursor-pointer transition-transform ${
                      !isErasing && penColor === c ? 'scale-110 border-foreground' : 'border-border'
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Pilih warna ${c}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsErasing((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  isErasing ? 'bg-primary text-white' : 'bg-muted text-ink-soft hover:text-foreground'
                }`}
              >
                <Eraser className="size-3.5" />
                <span>{language === 'id' ? 'Hapus' : 'Erase'}</span>
              </button>
              <button
                type="button"
                onClick={handleUndo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-ink-soft hover:text-foreground text-xs font-bold cursor-pointer transition-colors"
              >
                <Undo2 className="size-3.5" />
                <span>Undo</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-ink-soft hover:text-foreground text-xs font-bold cursor-pointer transition-colors"
              >
                <RotateCcw className="size-3.5" />
                <span>{language === 'id' ? 'Bersihkan' : 'Clear'}</span>
              </button>

              <div className="flex-1" />

              <button
                type="button"
                onClick={handleSaveImage}
                disabled={isLoading || !!loadError}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mint-soft text-mint text-xs font-bold cursor-pointer transition-colors hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save className="size-3.5" />
                <span>{language === 'id' ? 'Simpan Gambar' : 'Save image'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSheet(null)}
                className="size-8 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer"
                aria-label="Tutup"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Page navigation */}
            <div className="flex items-center justify-center gap-3 py-2 border-b border-border bg-card/60">
              <button
                type="button"
                onClick={() => goToPage(-1)}
                disabled={currentPage <= 1 || isLoading}
                className="size-7 rounded-full bg-muted text-ink-soft hover:text-foreground flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label={language === 'id' ? 'Halaman sebelumnya' : 'Previous page'}
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-xs font-bold text-ink-soft min-w-[90px] text-center">
                {language === 'id' ? 'Halaman' : 'Page'} {currentPage} / {pageCount}
              </span>
              <button
                type="button"
                onClick={() => goToPage(1)}
                disabled={currentPage >= pageCount || isLoading}
                className="size-7 rounded-full bg-muted text-ink-soft hover:text-foreground flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label={language === 'id' ? 'Halaman berikutnya' : 'Next page'}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Canvas: the real worksheet page, drawable on top */}
            <div className="flex-1 overflow-auto bg-muted/60 p-4 flex justify-center relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/60 z-10">
                  <Loader2 className="size-8 text-primary animate-spin" />
                </div>
              )}
              {loadError ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-center max-w-xs">
                  <p className="text-sm text-ink-soft">{loadError}</p>
                  <MoraButton
                    variant="secondary"
                    size="sm"
                    onClick={() => activeSheet && showPage(currentPage)}
                  >
                    {language === 'id' ? 'Coba lagi' : 'Try again'}
                  </MoraButton>
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  className="bg-white rounded-xl shadow-2xs touch-none w-full max-w-[560px] h-auto"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
