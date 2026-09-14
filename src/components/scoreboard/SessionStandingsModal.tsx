'use client';

import React, { useEffect, useState } from 'react';
import { getSessionStats, resetSessionStats, type SessionStats } from '@/lib/sessionStats';

interface SessionStandingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SessionStandingsModal({ isOpen, onClose }: SessionStandingsModalProps) {
  const [stats, setStats] = useState<SessionStats>({});
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStats(getSessionStats());
      setConfirmReset(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const rows = Object.entries(stats).sort(([, a], [, b]) => b.wins - a.wins);

  const handleResetSession = () => {
    if (confirmReset) {
      resetSessionStats();
      setStats({});
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div
        className="w-full max-w-md text-white"
        style={{ backgroundColor: '#171717', borderRadius: '24px', padding: '28px 24px' }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            style={{
              fontFamily: 'var(--font-instrument-serif), Newsreader, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '28px',
            }}
          >
            🏆 Tabla de sesión
          </h2>
          <button
            onClick={onClose}
            className="transition-all active:scale-90"
            style={{
              backgroundColor: '#2E2E2E',
              borderRadius: '9999px',
              width: '32px',
              height: '32px',
              fontFamily: 'var(--font-geist-sans), sans-serif',
            }}
          >
            ✕
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="py-8 text-center" style={{ color: '#B5B5B3', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
            Aún no hay partidos ganados en esta sesión.
          </p>
        ) : (
          <div className="mb-6 space-y-2">
            <div
              className="flex justify-between px-2 text-sm"
              style={{ color: '#9B9B98', fontFamily: 'var(--font-geist-sans), sans-serif' }}
            >
              <span>Jugador</span>
              <span>Copas · Partidos</span>
            </div>
            {rows.map(([name, s], i) => (
              <div
                key={name}
                className="flex items-center justify-between"
                style={{ backgroundColor: '#232323', borderRadius: '16px', padding: '14px 16px' }}
              >
                <span style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontWeight: 600, fontSize: '15px' }}>
                  {i === 0 && s.wins > 0 && '🏆 '}
                  {name}
                </span>
                <span style={{ color: '#B5B5B3', fontFamily: 'var(--font-geist-sans), sans-serif', fontWeight: 700 }}>
                  {s.wins} · {s.matches}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleResetSession}
          className="w-full transition-all active:scale-[0.98]"
          style={{
            backgroundColor: confirmReset ? '#ef4444' : '#2E2E2E',
            borderRadius: '9999px',
            padding: '14px',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontWeight: 700,
            fontSize: '15px',
          }}
        >
          {confirmReset ? '¿Seguro? Toca de nuevo para borrar todo' : '🗑️ Reset de sesión'}
        </button>
      </div>
    </div>
  );
}
