'use client';

import React, { useState } from 'react';
import { ResetModal } from './ResetModal';

interface ControlPanelProps {
  onExitToMenu: () => void;
  onResetMatch: () => void;
  onResetSession: () => void;
  onResetAll: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onSwap?: () => void;
  onOpenDisplay?: () => void;
  onOpenStandings?: () => void;
  onOpenRemote?: () => void;
  remoteActive?: boolean;
}

export function ControlPanel({
  onExitToMenu,
  onResetMatch,
  onResetSession,
  onResetAll,
  onUndo,
  canUndo,
  onSwap,
  onOpenDisplay,
  onOpenStandings,
  onOpenRemote,
  remoteActive = false,
}: ControlPanelProps) {
  const [showResetModal, setShowResetModal] = useState(false);

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
          onClick={() => setShowResetModal(true)}
          className="shrink-0 whitespace-nowrap rounded bg-gray-700 px-3 py-2 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-gray-600"
        >
          🔄 Reset
        </button>

        {onSwap && (
          <button
            onClick={onSwap}
            className="shrink-0 whitespace-nowrap rounded bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-purple-700"
          >
            ↔️ Intercambiar
          </button>
        )}

        {onOpenDisplay && (
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

        {onOpenRemote && (
          <button
            onClick={onOpenRemote}
            className={`shrink-0 whitespace-nowrap rounded px-3 py-2 text-sm font-semibold text-white transition-all active:scale-95 ${
              remoteActive ? 'bg-green-600 hover:bg-green-700' : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {remoteActive ? '🔗 Vincular ✓' : '🔗 Vincular'}
          </button>
        )}
      </div>

      <ResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onExitToMenu={onExitToMenu}
        onResetMatch={onResetMatch}
        onResetSession={onResetSession}
        onResetAll={onResetAll}
      />
    </div>
  );
}
