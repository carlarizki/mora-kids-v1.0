/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Download, Pencil, Eraser, Undo2, RotateCcw, Save, X, FileText } from 'lucide-react';
import { MoraButton, MoraSectionHeader } from './ui/MoraPrimitives';
import { WORKSHEETS_CATALOG, WorksheetItem } from '../data/worksheets';
import { Language } from '../types/game';
import { sound } from '../utils/audio';

interface WorksheetSectionProps {
  language: Language;
}

type Stroke = { color: string; size: number; points: { x: number; y: number }[] };

const CANVAS_W = 794; // A4 @ 96dpi portrait width
const CANVAS_H = 1123;
const PEN_COLORS = ['#2D2A26', '#FF7A59', '#4C8DFF', '#2FB380', '#FFC24C'];

// Draws the static worksheet layout (title, activity boxes, reaction row, free-draw box)
function paintWorksheetBackground(ctx: CanvasRenderingContext2D, sheet: WorksheetItem) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Header band
  ctx.fillStyle = '#FF7A59';
  roundRect(ctx, 40, 40, CANVAS_W - 80, 90, 14);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px Nunito, sans-serif';
  ctx.fillText(`Mora — ${sheet.title}`, 64, 90);
  ctx.font = '16px DM Sans, sans-serif';
  ctx.fillText(`${sheet.tagline}  |  ${sheet.ageGroup}`, 64, 118);

  ctx.fillStyle = '#2D2A26';
  ctx.font = '15px DM Sans, sans-serif';
  ctx.fillText('Nama Anak: ______________________        Tanggal: __________', 40, 165);

  let y = 190;
  sheet.activities.forEach((activity) => {
    ctx.strokeStyle = '#E4DFD6';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 40, y, CANVAS_W - 80, 92, 10);
    ctx.stroke();

    ctx.fillStyle = '#FF7A59';
    ctx.font = 'bold 17px Nunito, sans-serif';
    ctx.fillText(activity.title, 60, y + 30);

    ctx.fillStyle = '#2D2A26';
    ctx.font = '14px DM Sans, sans-serif';
    wrapText(ctx, activity.description, 60, y + 52, CANVAS_W - 260, 18);

    ctx.fillStyle = '#8A8377';
    ctx.font = '13px DM Sans, sans-serif';
    ctx.fillText('Reaksi anak:', CANVAS_W - 220, y + 32);
    ctx.font = '22px sans-serif';
    ctx.fillText('😍   😐   😴', CANVAS_W - 220, y + 60);

    y += 108;
  });

  ctx.fillStyle = '#8A8377';
  ctx.font = 'italic 13px DM Sans, sans-serif';
  ctx.fillText('Coret-coret bebas di sini, Mama/Papa boleh ikut gambar juga!', 40, y + 24);
  ctx.strokeStyle = '#E4DFD6';
  roundRect(ctx, 40, y + 36, CANVAS_W - 80, CANVAS_H - y - 76, 10);
  ctx.stroke();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let cy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = word;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cy);
}

export const WorksheetSection: React.FC<WorksheetSectionProps> = ({ language }) => {
  const [activeSheet, setActiveSheet] = useState<WorksheetItem | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef<Stroke | null>(null);
  const [penColor, setPenColor] = useState(PEN_COLORS[0]);
  const [isErasing, setIsErasing] = useState(false);

  const redraw = () => {
    const canvas = canvasRef.current;
    const sheet = activeSheet;
    if (!canvas || !sheet) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    paintWorksheetBackground(ctx, sheet);
    strokesRef.current.forEach((stroke) => {
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

  useEffect(() => {
    if (activeSheet) {
      strokesRef.current = [];
      redraw();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSheet]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    const stroke: Stroke = {
      color: isErasing ? '#FFFFFF' : penColor,
      size: isErasing ? 26 : 5,
      points: [getPos(e)],
    };
    drawingRef.current = stroke;
    strokesRef.current.push(stroke);
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
    strokesRef.current.pop();
    redraw();
    sound.playPop();
  };

  const handleClear = () => {
    strokesRef.current = [];
    redraw();
    sound.playPop();
  };

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !activeSheet) return;
    const link = document.createElement('a');
    link.download = `${activeSheet.id}-coretan.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    sound.playSuccess();
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

      {/* Annotate Modal */}
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mint-soft text-mint text-xs font-bold cursor-pointer transition-colors hover:opacity-80"
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

            {/* Canvas */}
            <div className="flex-1 overflow-auto bg-muted/60 p-4 flex justify-center">
              <canvas
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className="bg-white rounded-xl shadow-2xs touch-none w-full max-w-[560px] h-auto"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
