'use client';

import React, { useState } from 'react';

interface ControlPanelProps {
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  gameOver?: boolean;
  onSwap?: () => void;
  onOpenDisplay?: () => void;
  onOpenStandings?: () => void;
}

export function ControlPanel({ onReset, onUndo, canUndo, gameOver = false, onSwap, onOpenDisplay, onOpenStandings }: ControlPanelProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleReset = () => {
    if (showConfirmReset) {
      onReset();
      setShowConfirmReset(false);
    } else {
      setShowConfirmReset(true);
      setTimeout(() => setShowConfirmReset(false), 3000); // Reset confirmation after 3 seconds
    }
  };

  return (
    <div className="w-full flex-none border-t border-gray-600 bg-gray-900 shadow-lg">
      <div className="flex items-center gap-2 overflow-x-auto px-2 py-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="shrink-0 whitespace-nowrap rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-all active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          ↶ Deshacer
        </button>

        <button
          onClick={handleReset}
          className={`shrink-0 whitespace-nowrap rounded px-3 py-2 text-sm font-semibold text-white transition-all active:scale-95 ${
            showConfirmReset ? 'bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {showConfirmReset ? '¿Seguro?' : '🔄 Reset'}
        </button>

        {!gameOver && onSwap && (
          <button
            onClick={onSwap}
            className="shrink-0 whitespace-nowrap rounded bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-purple-700"
          >
            ↔️ Intercambiar
          </button>
        )}

        {!gameOver && onOpenDisplay && (
          <button
            onClick={onOpenDisplay}
            className="shrink-0 whitespace-nowrap rounded bg-orange-600 px-3 py-2 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-orange-700"
          >
            📺 Pantalla
          </button>
        )}

        {onOpenStandings && (
          <button
            onClick={onOpenStandings}
            className="shrink-0 whitespace-nowrap rounded bg-yellow-600 px-3 py-2 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-yellow-700"
          >
            🏆 Tabla
          </button>
        )}

        {gameOver && (
          <button
            onClick={onReset}
            className="shrink-0 whitespace-nowrap rounded bg-green-600 px-3 py-2 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-green-700"
          >
            ✓ Nuevo Juego
          </button>
        )}
      </div>
    </div>
  );
}
