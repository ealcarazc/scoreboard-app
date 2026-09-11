'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { channelName, type RemoteAction, type RemoteState } from '@/lib/remoteChannel';

interface BoardOptions {
  role: 'board';
  roomCode: string | null;
  onAction: (action: RemoteAction) => void;
  state?: RemoteState | null;
}

interface RemoteOptions {
  role: 'remote';
  roomCode: string | null;
  onState: (state: RemoteState) => void;
}

type Options = BoardOptions | RemoteOptions;

export function useRemoteChannel(opts: Options) {
  const [connected, setConnected] = useState(false);
  const [peerConnected, setPeerConnected] = useState(false);
  const channelRef = useRef<any>(null);
  const onActionRef = useRef<((a: RemoteAction) => void) | undefined>(undefined);
  const onStateRef = useRef<((s: RemoteState) => void) | undefined>(undefined);
  const latestStateRef = useRef<RemoteState | null>(null);

  onActionRef.current = opts.role === 'board' ? opts.onAction : undefined;
  onStateRef.current = opts.role === 'remote' ? opts.onState : undefined;
  if (opts.role === 'board') latestStateRef.current = opts.state ?? null;

  const { role, roomCode } = opts;

  useEffect(() => {
    if (!supabase || !roomCode) {
      setConnected(false);
      setPeerConnected(false);
      return;
    }

    const channel = supabase.channel(channelName(roomCode), {
      config: { broadcast: { self: false }, presence: { key: role } },
    });

    if (role === 'board') {
      channel.on('broadcast', { event: 'action' }, ({ payload }: any) => {
        onActionRef.current?.(payload as RemoteAction);
      });
      channel.on('presence', { event: 'sync' }, () => {
        const others = Object.keys(channel.presenceState()).filter((k) => k !== 'board');
        setPeerConnected(others.length > 0);
      });
      channel.on('presence', { event: 'join' }, () => {
        // A remote just connected — send it the current state right away.
        if (latestStateRef.current) {
          channel.send({ type: 'broadcast', event: 'state', payload: latestStateRef.current });
        }
      });
    } else {
      channel.on('broadcast', { event: 'state' }, ({ payload }: any) => {
        onStateRef.current?.(payload as RemoteState);
      });
    }

    channel.subscribe((status: string) => {
      const ok = status === 'SUBSCRIBED';
      setConnected(ok);
      if (ok) channel.track({ online: true });
    });

    channelRef.current = channel;

    return () => {
      supabase?.removeChannel(channel);
      channelRef.current = null;
      setConnected(false);
      setPeerConnected(false);
    };
  }, [role, roomCode]);

  // Board: push state to the remote whenever it changes.
  const boardState = role === 'board' ? opts.state : null;
  const stateJson = boardState ? JSON.stringify(boardState) : null;
  useEffect(() => {
    if (role !== 'board' || !stateJson || !channelRef.current || !connected) return;
    channelRef.current.send({ type: 'broadcast', event: 'state', payload: JSON.parse(stateJson) });
  }, [role, stateJson, connected]);

  const sendAction = (action: RemoteAction) => {
    channelRef.current?.send({ type: 'broadcast', event: 'action', payload: action });
  };

  return { connected, peerConnected, sendAction };
}
