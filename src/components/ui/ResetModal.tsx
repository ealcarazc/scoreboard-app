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

const font = 'var(--font-geist-sans), sans-serif';

const optionButtonStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'left',
  borderRadius: '16px',
  padding: '14px 16px',
  fontFamily: font,
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
        className="w-full max-w-md text-white sm:rounded-[24px]"
        style={{
          backgroundColor: '#171717',
          borderRadius: '24px 24px 0 0',
          padding: '28px 24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {pending === null ? (
          <>
            <h2
              className="mb-5 text-center"
              style={{ fontFamily: font, fontWeight: 700, fontSize: '20px' }}
            >
              Reset
            </h2>
            <div className="space-y-2">
              <button
                onClick={handleExit}
                className="transition-all active:scale-[0.98]"
                style={{ ...optionButtonStyle, backgroundColor: 'rgba(37,99,235,0.18)' }}
              >
                <p style={{ fontWeight: 700, fontSize: '15px' }}>🚪 Salir al menú</p>
                <p style={{ fontSize: '12px', color: '#93C5FD', marginTop: '2px' }}>
                  No borra nada — solo sales del partido actual
                </p>
              </button>

              <div className="my-3" style={{ borderTop: '1px solid #2A2A2A' }} />

              <button
                onClick={() => setPending('match')}
                className="transition-all active:scale-[0.98]"
                style={{ ...optionButtonStyle, backgroundColor: '#232323' }}
              >
                <p style={{ fontWeight: 700, fontSize: '15px' }}>Reset de partido</p>
                <p style={{ fontSize: '12px', color: '#9B9B98', marginTop: '2px' }}>Solo el marcador actual</p>
              </button>
              <button
                onClick={() => setPending('session')}
                className="transition-all active:scale-[0.98]"
                style={{ ...optionButtonStyle, backgroundColor: '#232323', marginTop: '8px' }}
              >
                <p style={{ fontWeight: 700, fontSize: '15px' }}>Reset de sesión</p>
                <p style={{ fontSize: '12px', color: '#9B9B98', marginTop: '2px' }}>Marcador + tabla de victorias</p>
              </button>
              <button
                onClick={() => setPending('all')}
                className="transition-all active:scale-[0.98]"
                style={{ ...optionButtonStyle, backgroundColor: 'rgba(239,68,68,0.18)', marginTop: '8px' }}
              >
                <p style={{ fontWeight: 700, fontSize: '15px' }}>Reset completo</p>
                <p style={{ fontSize: '12px', color: '#FCA5A5', marginTop: '2px' }}>
                  Marcador, sesión, historial y serie (no las parejas)
                </p>
              </button>
            </div>
            <button
              onClick={handleClose}
              className="mt-4 w-full transition-all active:scale-[0.98]"
              style={{
                backgroundColor: '#2E2E2E',
                borderRadius: '9999px',
                padding: '14px',
                fontFamily: font,
                fontWeight: 700,
                fontSize: '15px',
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <div className="text-center">
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>⚠️</div>
            <h2 className="mb-2" style={{ fontFamily: font, fontWeight: 700, fontSize: '22px' }}>
              {LEVEL_INFO[pending].title}
            </h2>
            <p className="mb-6" style={{ fontFamily: font, fontSize: '15px', color: '#B5B5B3' }}>
              {LEVEL_INFO[pending].desc}
            </p>
            <div className="flex" style={{ gap: '10px' }}>
              <button
                onClick={() => setPending(null)}
                className="flex-1 transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: '#2E2E2E',
                  borderRadius: '9999px',
                  padding: '14px',
                  fontFamily: font,
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: '#ef4444',
                  borderRadius: '9999px',
                  padding: '14px',
                  fontFamily: font,
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
