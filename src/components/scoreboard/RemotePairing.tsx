'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { remoteUrl } from '@/lib/remoteChannel';

interface RemotePairingProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  connected: boolean;
  peerConnected: boolean;
}

export function RemotePairing({ isOpen, onClose, roomCode, connected, peerConnected }: RemotePairingProps) {
  if (!isOpen) return null;

  const url = remoteUrl(roomCode);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-6" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-1 text-xl font-bold">Vincular otro dispositivo</h2>
        <p className="mb-4 text-sm text-gray-500">
          Escanéalo desde el iPad o el teléfono — se ve el mismo marcador grande y también se puede anotar ahí
        </p>

        <div className="mx-auto mb-4 w-fit rounded-xl bg-white p-3 ring-1 ring-gray-200">
          <QRCodeSVG value={url} size={200} level="M" />
        </div>

        <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">O abre en el teléfono</p>
        <p className="mb-1 break-all text-sm font-semibold text-gray-700">{url}</p>
        <p className="mb-4 text-3xl font-black tracking-[0.2em] text-gray-900">{roomCode}</p>

        <div
          className="mb-4 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{
            backgroundColor: peerConnected ? '#dcfce7' : connected ? '#fef9c3' : '#fee2e2',
            color: peerConnected ? '#166534' : connected ? '#854d0e' : '#991b1b',
          }}
        >
          {peerConnected
            ? '✓ Teléfono conectado'
            : connected
              ? 'Esperando al teléfono…'
              : 'Conectando al servicio…'}
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white transition-all active:scale-[0.98]"
        >
          Listo
        </button>
      </div>
    </div>
  );
}
