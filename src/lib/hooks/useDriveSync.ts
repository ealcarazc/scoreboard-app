'use client';

import { useCallback, useEffect, useState } from 'react';
import { isDriveConfigured, isDriveConnected, disconnectDrive } from '@/lib/googleDrive';
import { connectAndPull, pushToDrive, type SyncStatus } from '@/lib/driveSync';

export function useDriveSync() {
  const [status, setStatus] = useState<SyncStatus>('not-connected');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(isDriveConnected());
  }, []);

  const connect = useCallback(async () => {
    setStatus('syncing');
    const result = await connectAndPull();
    setStatus(result.status);
    setConnected(!!result.token);
  }, []);

  const disconnect = useCallback(() => {
    disconnectDrive();
    setConnected(false);
    setStatus('not-connected');
  }, []);

  const sync = useCallback(async () => {
    if (!isDriveConnected()) return;
    setStatus('syncing');
    const result = await pushToDrive();
    setStatus(result);
  }, []);

  return {
    configured: isDriveConfigured(),
    connected,
    status,
    connect,
    disconnect,
    sync,
  };
}
