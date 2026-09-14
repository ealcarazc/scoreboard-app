'use client';

import React from 'react';
import { useDriveSync } from '@/lib/hooks/useDriveSync';

const ghostStyle: React.CSSProperties = {
  backgroundColor: 'var(--sb-card-bg)',
  border: '1px solid var(--sb-card-border)',
  borderRadius: '9999px',
  padding: '16px 24px',
  fontFamily: 'var(--font-geist-sans), sans-serif',
  fontWeight: 600,
  fontSize: '16px',
  color: 'var(--sb-text)',
  width: '100%',
  maxWidth: '320px',
};

export function DriveSyncStatus() {
  const { configured, connected, status, connect, disconnect } = useDriveSync();

  if (!configured) return null;

  if (!connected) {
    return (
      <button
        onClick={connect}
        disabled={status === 'syncing'}
        className="transition-all active:scale-95 disabled:opacity-50"
        style={ghostStyle}
      >
        {status === 'syncing' ? '⟳ Conectando…' : '🔗 Conectar Google Drive'}
      </button>
    );
  }

  const label =
    status === 'syncing' ? '⟳ Sincronizando' : status === 'offline' ? '✗ Sin conexión' : '✓ Sincronizado';

  return (
    <button onClick={disconnect} className="transition-all active:scale-95" style={ghostStyle} title="Toca para desconectar Google Drive">
      {label}
    </button>
  );
}
