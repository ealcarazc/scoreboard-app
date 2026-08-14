'use client';

import { requestDriveAccess, readDriveFile, writeDriveFile, isDriveConnected } from '@/lib/googleDrive';
import { getSessionStats, type SessionStats } from '@/lib/sessionStats';
import { getRecentPairs, type RecentPair } from '@/lib/recentPairs';
import { getSeriesState, type SeriesState } from '@/lib/seriesTracker';
import { getMatchHistory, setMatchHistory, type MatchHistoryEntry } from '@/lib/matchHistory';

interface DrivePlayer {
  name: string;
  color: string;
}

interface DriveRecentPair {
  player1: string;
  player2: string;
  lastPlayed: string;
}

interface DriveSeries {
  player1: string;
  player2: string;
  wins: Record<string, number>;
  format: string | null;
}

export interface DriveData {
  players: DrivePlayer[];
  recentPairs: DriveRecentPair[];
  matchHistory: MatchHistoryEntry[];
  sessionStats: Record<string, number>;
  currentSeries: DriveSeries | null;
}

function buildDriveData(): DriveData {
  const recentPairs = getRecentPairs();
  const stats = getSessionStats();
  const series = getSeriesState();

  const playerMap = new Map<string, string>();
  for (const pair of recentPairs) {
    if (!playerMap.has(pair.player1.name)) playerMap.set(pair.player1.name, pair.player1.color);
    if (!playerMap.has(pair.player2.name)) playerMap.set(pair.player2.name, pair.player2.color);
  }

  return {
    players: Array.from(playerMap.entries()).map(([name, color]) => ({ name, color })),
    recentPairs: recentPairs.map((p) => ({
      player1: p.player1.name,
      player2: p.player2.name,
      lastPlayed: new Date(p.lastPlayed).toISOString().slice(0, 10),
    })),
    matchHistory: getMatchHistory(),
    sessionStats: Object.fromEntries(Object.entries(stats).map(([name, s]) => [name, s.wins])),
    currentSeries: series
      ? {
          player1: series.p1Name,
          player2: series.p2Name,
          wins: { [series.p1Name]: series.p1Wins, [series.p2Name]: series.p2Wins },
          format: null,
        }
      : null,
  };
}

// Hydrates localStorage from Drive data, keyed to the shapes each existing
// module already expects, so the rest of the app keeps working unchanged.
function applyDriveData(data: DriveData) {
  if (typeof window === 'undefined') return;

  if (data.recentPairs?.length && data.players?.length) {
    const colorByName = new Map(data.players.map((p) => [p.name, p.color]));
    const recentPairs: RecentPair[] = data.recentPairs.map((p) => ({
      player1: { name: p.player1, color: colorByName.get(p.player1) || '#3b82f6' },
      player2: { name: p.player2, color: colorByName.get(p.player2) || '#ef4444' },
      lastPlayed: new Date(p.lastPlayed).getTime(),
    }));
    localStorage.setItem('recentPairs', JSON.stringify(recentPairs));
  }

  if (data.sessionStats) {
    const matchCounts: Record<string, number> = {};
    for (const entry of data.matchHistory || []) {
      matchCounts[entry.player1] = (matchCounts[entry.player1] || 0) + 1;
      matchCounts[entry.player2] = (matchCounts[entry.player2] || 0) + 1;
    }
    const stats: SessionStats = {};
    for (const [name, wins] of Object.entries(data.sessionStats)) {
      stats[name] = { wins, matches: matchCounts[name] || wins };
    }
    localStorage.setItem('sessionStats', JSON.stringify(stats));
  }

  if (data.currentSeries) {
    const { player1, player2, wins } = data.currentSeries;
    const state: SeriesState = {
      key: [player1, player2].sort().join('|') + '::' + 'unknown',
      p1Name: player1,
      p2Name: player2,
      sport: 'unknown',
      p1Wins: wins[player1] || 0,
      p2Wins: wins[player2] || 0,
    };
    localStorage.setItem('activeSeries', JSON.stringify(state));
  }

  if (data.matchHistory) {
    setMatchHistory(data.matchHistory);
  }
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'not-connected';

export async function connectAndPull(): Promise<{ status: SyncStatus; token: string | null }> {
  const token = await requestDriveAccess();
  if (!token) return { status: 'offline', token: null };

  try {
    const remote = await readDriveFile(token);
    if (remote) {
      applyDriveData(remote as DriveData);
    } else {
      await writeDriveFile(token, buildDriveData());
    }
    return { status: 'synced', token };
  } catch {
    return { status: 'offline', token };
  }
}

export async function pushToDrive(): Promise<SyncStatus> {
  if (!isDriveConnected()) return 'not-connected';
  const token = await requestDriveAccess();
  if (!token) return 'offline';

  try {
    await writeDriveFile(token, buildDriveData());
    return 'synced';
  } catch {
    return 'offline';
  }
}
