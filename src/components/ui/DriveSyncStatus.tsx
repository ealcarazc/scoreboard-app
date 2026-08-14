'use client';

import React from 'react';
import { useDriveSync } from '@/lib/hooks/useDriveSync';

export function DriveSyncStatus() {
  const { configured, connected, status, connect, disconnect } = useDriveSync();

  if (!configured) return null;

  if (!connected) {
    return (
      <button
        onClick={connect}
        disabled={status === 'syncing'}
        className="text-xs transition-opacity hover:opacity-70 disabled:opacity-50"
        style={{ color: 'var(--sb-text-secondary)', fontFamily: "'Geist Sans', sans-serif" }}
      >
        {status === 'syncing' ? '⟳ Conectando…' : '🔗 Conectar Google Drive'}
      </button>
    );
  }

  const label =
    status === 'syncing' ? '⟳ Sincronizando' : status === 'offline' ? '✗ Sin conexión' : '✓ Sincronizado';

  return (
    <button
      onClick={disconnect}
      className="text-xs transition-opacity hover:opacity-70"
      style={{ color: 'var(--sb-text-secondary)', fontFamily: "'Geist Sans', sans-serif" }}
      title="Toca para desconectar Google Drive"
    >
      {label}
    </button>
  );
}
