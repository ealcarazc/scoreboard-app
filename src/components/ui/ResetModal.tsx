'use client';

import React, { useState } from 'react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExitToMenu: () => void;
  onResetMatch: () => void;
  onResetSession: () => void;
  onResetAll: () => void;
}

type Level = 'match' | 'session' | 'all';

const LEVEL_INFO: Record<Level, { title: string; desc: string }> = {
  match: { title: 'Reset de partido', desc: 'Borra solo el marcador y sets del partido en curso.' },
  session: { title: 'Reset de sesión', desc: 'Borra el marcador actual y la tabla de victorias de la sesión.' },
  all: {
    title: 'Reset completo',
    desc: 'Borra marcador, sesión, historial y serie en curso. Las parejas recientes no se borran.',
  },
};

export function ResetModal({
  isOpen,
  onClose,
  onExitToMenu,
  onResetMatch,
  onResetSession,
  onResetAll,
}: ResetModalProps) {
  const [pending, setPending] = useState<Level | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setPending(null);
    onClose();
  };

  const handleExit = () => {
    setPending(null);
    onClose();
    onExitToMenu();
  };

  const handleConfirm = () => {
    if (pending === 'match') onResetMatch();
    else if (pending === 'session') onResetSession();
    else if (pending === 'all') onResetAll();
    setPending(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 sm:items-center"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-gray-800 p-5 text-white sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {pending === null ? (
          <>
            <h2 className="mb-4 text-center text-lg font-bold">Reset</h2>
            <div className="space-y-2">
              <button
                onClick={handleExit}
                className="w-full rounded-lg bg-blue-900/50 px-4 py-3 text-left transition-all hover:bg-blue-900/70 active:scale-[0.98]"
              >
                <p className="font-semibold">🚪 Salir al menú</p>
                <p className="text-xs text-blue-200">No borra nada — solo sales del partido actual</p>
              </button>

              <div className="my-3 border-t border-gray-700" />

              <button
                onClick={() => setPending('match')}
                className="w-full rounded-lg bg-gray-700 px-4 py-3 text-left transition-all hover:bg-gray-600 active:scale-[0.98]"
              >
                <p className="font-semibold">Reset de partido</p>
                <p className="text-xs text-gray-400">Solo el marcador actual</p>
              </button>
              <button
                onClick={() => setPending('session')}
                className="w-full rounded-lg bg-gray-700 px-4 py-3 text-left transition-all hover:bg-gray-600 active:scale-[0.98]"
              >
                <p className="font-semibold">Reset de sesión</p>
                <p className="text-xs text-gray-400">Marcador + tabla de victorias</p>
              </button>
              <button
                onClick={() => setPending('all')}
                className="w-full rounded-lg bg-red-900/50 px-4 py-3 text-left transition-all hover:bg-red-900/70 active:scale-[0.98]"
              >
                <p className="font-semibold">Reset completo</p>
                <p className="text-xs text-gray-300">Marcador, sesión, historial y serie (no las parejas)</p>
              </button>
            </div>
            <button
              onClick={handleClose}
              className="mt-4 w-full rounded-lg bg-gray-700 px-4 py-3 font-semibold transition-all hover:bg-gray-600 active:scale-[0.98]"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <h2 className="mb-2 text-center text-lg font-bold">{LEVEL_INFO[pending].title}</h2>
            <p className="mb-5 text-center text-sm text-gray-300">¿Seguro? {LEVEL_INFO[pending].desc}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setPending(null)}
                className="flex-1 rounded-lg bg-gray-700 px-4 py-3 font-semibold transition-all hover:bg-gray-600 active:scale-[0.98]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold transition-all hover:bg-red-700 active:scale-[0.98]"
              >
                Confirmar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
