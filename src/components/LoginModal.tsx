/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Lock, User } from 'lucide-react';
import { MoraLogo, MoraButton } from './ui/MoraPrimitives';
import { tryLogin } from '../utils/auth';
import { Language } from '../types/game';
import { sound } from '../utils/audio';

interface LoginModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, language, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tryLogin(username, password)) {
      setError(null);
      sound.playSuccess();
      onSuccess();
    } else {
      setError(
        language === 'id'
          ? 'Username atau password salah. Minta ke Carla ya!'
          : 'Wrong username or password. Ask Carla for it!'
      );
      sound.playGentleBoing();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs animate-in fade-in">
      <div className="paper-card rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-play border border-border relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 size-8 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer"
          aria-label={language === 'id' ? 'Tutup' : 'Close'}
        >
          <X className="size-4" />
        </button>

        <div className="flex justify-center mb-4">
          <MoraLogo />
        </div>
        <h3 className="font-display text-xl font-black text-foreground text-center">
          {language === 'id' ? 'Masuk ke Mora' : 'Log in to Mora'}
        </h3>
        <p className="text-xs text-ink-soft text-center mt-1 mb-6">
          {language === 'id'
            ? 'Testing tertutup — pakai username & password yang dibagikan Carla.'
            : "Closed testing — use the username & password Carla shared with you."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={language === 'id' ? 'Username' : 'Username'}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              autoFocus
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'id' ? 'Password' : 'Password'}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {error && <p className="text-xs text-destructive text-center">{error}</p>}

          <MoraButton type="submit" variant="joyful" className="w-full justify-center">
            {language === 'id' ? 'Masuk & Mulai Main' : 'Log in & Start Playing'}
          </MoraButton>
        </form>
      </div>
    </div>
  );
};
