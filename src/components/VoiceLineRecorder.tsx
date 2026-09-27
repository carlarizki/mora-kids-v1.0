/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Play, Trash2 } from 'lucide-react';
import { VoiceLineDef, getVoiceLine, saveVoiceLine, deleteVoiceLine, blobToDataUrl } from '../utils/voiceRecorder';
import { Language } from '../types/game';
import { sound } from '../utils/audio';

interface VoiceLineRecorderProps {
  line: VoiceLineDef;
  language: Language;
}

export const VoiceLineRecorder: React.FC<VoiceLineRecorderProps> = ({ line, language }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    setHasRecording(!!getVoiceLine(line.id));
  }, [line.id]);

  const handleStart = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(language === 'id' ? 'Mikrofon tidak didukung di browser ini.' : 'Microphone not supported here.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const dataUrl = await blobToDataUrl(blob);
        saveVoiceLine(line.id, dataUrl);
        setHasRecording(true);
        stream.getTracks().forEach((t) => t.stop());
        sound.playSuccess();
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      sound.playPop();
    } catch {
      setError(
        language === 'id'
          ? 'Tidak bisa mengakses mikrofon. Cek izin browser.'
          : 'Could not access the microphone. Check your browser permission.'
      );
    }
  };

  const handleStop = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handlePlay = () => {
    const entry = getVoiceLine(line.id);
    if (entry) {
      const audio = new Audio(entry.dataUrl);
      audio.play().catch(() => {});
    }
  };

  const handleDelete = () => {
    deleteVoiceLine(line.id);
    setHasRecording(false);
    sound.playPop();
  };

  return (
    <div className="p-4 rounded-2xl border border-border bg-card flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-ink-soft">{line.label}</p>
        <p className="text-sm text-foreground italic mt-0.5 truncate">"{line.script}"</p>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {hasRecording && !isRecording && (
          <>
            <button
              type="button"
              onClick={handlePlay}
              className="size-8 rounded-full bg-secondary text-primary flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors"
              aria-label={language === 'id' ? 'Dengarkan rekaman' : 'Play recording'}
            >
              <Play className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="size-8 rounded-full bg-muted text-ink-soft flex items-center justify-center cursor-pointer hover:text-destructive transition-colors"
              aria-label={language === 'id' ? 'Hapus rekaman' : 'Delete recording'}
            >
              <Trash2 className="size-3.5" />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={isRecording ? handleStop : handleStart}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold cursor-pointer transition-colors ${
            isRecording ? 'bg-destructive text-white animate-pulse' : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {isRecording ? <Square className="size-3.5" /> : <Mic className="size-3.5" />}
          <span>
            {isRecording
              ? language === 'id'
                ? 'Berhenti'
                : 'Stop'
              : hasRecording
              ? language === 'id'
                ? 'Rekam Ulang'
                : 'Re-record'
              : language === 'id'
              ? 'Rekam'
              : 'Record'}
          </span>
        </button>
      </div>
    </div>
  );
};
