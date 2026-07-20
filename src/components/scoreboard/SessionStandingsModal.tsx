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
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">🏆 Tabla de Sesión</h2>
          <button onClick={onClose} className="rounded bg-gray-700 px-3 py-1 hover:bg-gray-600">
            ✕
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="py-8 text-center text-gray-400">Aún no hay partidos ganados en esta sesión.</p>
        ) : (
          <div className="mb-6 space-y-2">
            <div className="flex justify-between px-2 text-sm text-gray-400">
              <span>Jugador</span>
              <span>Copas · Partidos</span>
            </div>
            {rows.map(([name, s], i) => (
              <div key={name} className="flex items-center justify-between rounded bg-gray-700 px-4 py-3">
                <span className="font-semibold">
                  {i === 0 && s.wins > 0 && '🏆 '}
                  {name}
                </span>
                <span className="text-gray-300">
                  {s.wins} · {s.matches}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleResetSession}
          className={`w-full rounded px-4 py-3 font-semibold transition-all active:scale-95 ${
            confirmReset ? 'bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {confirmReset ? '¿Seguro? Toca de nuevo para borrar todo' : '🗑️ Reset de Sesión'}
        </button>
      </div>
    </div>
  );
}
