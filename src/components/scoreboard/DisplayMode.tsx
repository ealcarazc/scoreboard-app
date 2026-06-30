'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Match, PlayerInfo } from '@/types';

interface DisplayModeProps {
  matchId: string;
}

export function DisplayMode({ matchId }: DisplayModeProps) {
  const [match, setMatch] = useState<Match | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (data && !error) {
        const p1: PlayerInfo = {
          id: 'p1',
          name: data.player1_name,
          color: data.player1_color,
          isFrequent: false,
        };

        const p2: PlayerInfo = {
          id: 'p2',
          name: data.player2_name,
          color: data.player2_color,
          isFrequent: false,
        };

        const matchData: Match = {
          id: data.id,
          sport: data.sport,
          players: { p1, p2 },
          format: data.format,
          currentSet: 1,
          currentPoints: { p1: data.current_points_p1, p2: data.current_points_p2 },
          currentGames: { p1: data.current_games_p1, p2: data.current_games_p2 },
          currentSets: { p1: data.current_sets_p1, p2: data.current_sets_p2 },
          currentServer: data.current_server,
          isInTiebreak: data.is_in_tiebreak,
          result: data.result,
          startTime: new Date(data.start_time),
          endTime: data.end_time ? new Date(data.end_time) : undefined,
          history: [],
        };
        setMatch(matchData);
      }
    };

    fetchMatch();

    const channel = supabase
      .channel(`match:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          if (payload.new) {
            const data = payload.new as any;

            const p1: PlayerInfo = {
              id: 'p1',
              name: data.player1_name,
              color: data.player1_color,
              isFrequent: false,
            };

            const p2: PlayerInfo = {
              id: 'p2',
              name: data.player2_name,
              color: data.player2_color,
              isFrequent: false,
            };

            const matchData: Match = {
              id: data.id,
              sport: data.sport,
              players: { p1, p2 },
              format: data.format,
              currentSet: 1,
              currentPoints: { p1: data.current_points_p1, p2: data.current_points_p2 },
              currentGames: { p1: data.current_games_p1, p2: data.current_games_p2 },
              currentSets: { p1: data.current_sets_p1, p2: data.current_sets_p2 },
              currentServer: data.current_server,
              isInTiebreak: data.is_in_tiebreak,
              result: data.result,
              startTime: new Date(data.start_time),
              endTime: data.end_time ? new Date(data.end_time) : undefined,
              history: [],
            };
            setMatch(matchData);
            setIsConnected(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  if (!match) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white text-2xl">
        Cargando marcador...
      </div>
    );
  }

  let p1Score: string | number = match.currentPoints.p1;
  let p2Score: string | number = match.currentPoints.p2;
  let subtitle1 = '';
  let subtitle2 = '';

  if (match.sport === 'tennis') {
    subtitle1 = `Sets ${match.currentSets.p1}-${match.currentSets.p2} | Games ${match.currentGames.p1}-${match.currentGames.p2}`;
    subtitle2 = `Sets ${match.currentSets.p1}-${match.currentSets.p2} | Games ${match.currentGames.p1}-${match.currentGames.p2}`;

    const p1Pts = match.currentPoints.p1;
    const p2Pts = match.currentPoints.p2;

    if (match.isInTiebreak) {
      p1Score = p1Pts;
      p2Score = p2Pts;
    } else {
      if (p1Pts >= 3 && p2Pts >= 3) {
        if (p1Pts === p2Pts) {
          p1Score = 'DEUCE';
          p2Score = 'DEUCE';
        } else if (p1Pts > p2Pts) {
          p1Score = 'AD';
          p2Score = '';
        } else {
          p1Score = '';
          p2Score = 'AD';
        }
      } else {
        const pointMap = ['0', '15', '30', '40'];
        p1Score = pointMap[Math.min(p1Pts, 3)];
        p2Score = pointMap[Math.min(p2Pts, 3)];
      }
    }
  }

  const p1Serving = match.currentServer === 'p1';
  const p2Serving = match.currentServer === 'p2';

  return (
    <div className="flex h-screen w-screen select-none overflow-hidden bg-black">
      <div className={`absolute top-4 right-4 text-sm px-3 py-1 rounded z-10 ${isConnected ? 'bg-green-600' : 'bg-gray-600'}`}>
        {isConnected ? 'Sincronizado' : 'Esperando...'}
      </div>

      <div className="flex w-1/2 flex-col items-center justify-center gap-2" style={{ backgroundColor: match.players.p1.color }}>
        <div className="text-center">
          <h2 className="font-bold text-white drop-shadow-lg" style={{ fontSize: '64px' }}>
            {match.players.p1.name}
          </h2>
          {p1Serving && <p className="text-5xl text-white drop-shadow-lg">🎾</p>}
          {subtitle1 && <p className="text-xl text-white drop-shadow-lg">{subtitle1}</p>}
        </div>
        <div className="font-bold text-white drop-shadow-lg" style={{ fontSize: '280px', lineHeight: '1' }}>
          {p1Score}
        </div>
      </div>

      <div className="w-2 bg-white"></div>

      <div className="flex w-1/2 flex-col items-center justify-center gap-2" style={{ backgroundColor: match.players.p2.color }}>
        <div className="text-center">
          <h2 className="font-bold text-white drop-shadow-lg" style={{ fontSize: '64px' }}>
            {match.players.p2.name}
          </h2>
          {p2Serving && <p className="text-5xl text-white drop-shadow-lg">🎾</p>}
          {subtitle2 && <p className="text-xl text-white drop-shadow-lg">{subtitle2}</p>}
        </div>
        <div className="font-bold text-white drop-shadow-lg" style={{ fontSize: '280px', lineHeight: '1' }}>
          {p2Score}
        </div>
      </div>
    </div>
  );
}
