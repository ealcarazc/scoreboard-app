'use client';

import React, { useState } from 'react';

interface ControlPanelProps {
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  gameOver?: boolean;
}

export function ControlPanel({ onReset, onUndo, canUndo, gameOver = false }: ControlPanelProps) {
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
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-600 bg-gray-900 p-4 shadow-lg">
      <div className="flex justify-center gap-4">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded bg-blue-600 px-6 py-3 font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
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

        {gameOver && (
          <button className="rounded bg-green-600 px-6 py-3 font-semibold text-white" disabled>
            ✓ Juego terminado
          </button>
        )}
      </div>
    </div>
  );
}
