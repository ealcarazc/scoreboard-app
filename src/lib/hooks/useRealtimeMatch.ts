'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Match } from '@/types';

export function useRealtimeMatch(matchId: string | null) {
  const [remoteMatch, setRemoteMatch] = useState<Match | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!matchId) return;

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`match:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          if (payload.new) {
            setRemoteMatch(payload.new as any);
            setIsConnected(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  const updateMatch = async (match: Match) => {
    if (!matchId) return;

    const { error } = await supabase
      .from('matches')
      .upsert({
        id: matchId,
        sport: match.sport,
        player1_name: match.players.p1.name,
        player1_color: match.players.p1.color,
        player2_name: match.players.p2.name,
        player2_color: match.players.p2.color,
        format: match.format,
        current_points_p1: match.currentPoints.p1,
        current_points_p2: match.currentPoints.p2,
        current_games_p1: match.currentGames.p1,
        current_games_p2: match.currentGames.p2,
        current_sets_p1: match.currentSets.p1,
        current_sets_p2: match.currentSets.p2,
        current_server: match.currentServer,
        is_in_tiebreak: match.isInTiebreak,
        result: match.result,
        end_time: match.endTime,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating match:', error);
    }
  };

  return { remoteMatch, isConnected, updateMatch };
}
