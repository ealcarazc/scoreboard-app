'use client';

import React, { useState } from 'react';

interface ControlPanelProps {
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  gameOver?: boolean;
  onSwap?: () => void;
}

export function ControlPanel({ onReset, onUndo, canUndo, gameOver = false, onSwap }: ControlPanelProps) {
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
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-600 bg-gray-900 p-4 shadow-lg z-50">
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded bg-blue-600 px-6 py-3 font-semibold text-white transition-all active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          ↶ Deshacer
        </button>

        <button
          onClick={handleReset}
          className={`rounded px-6 py-3 font-semibold text-white transition-all active:scale-95 ${
            showConfirmReset ? 'bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {showConfirmReset ? '¿Seguro? Tap de nuevo' : '🔄 Reset'}
        </button>

        {!gameOver && onSwap && (
          <button
            onClick={onSwap}
            className="rounded bg-purple-600 px-4 py-3 font-semibold text-white transition-all active:scale-95 hover:bg-purple-700 text-sm"
          >
            ↔️ Intercambiar
          </button>
        )}

        {gameOver && (
          <button
            onClick={onReset}
            className="rounded bg-green-600 px-6 py-3 font-semibold text-white transition-all active:scale-95 hover:bg-green-700"
          >
            ✓ Nuevo Juego
          </button>
        )}
      </div>
    </div>
  );
}
