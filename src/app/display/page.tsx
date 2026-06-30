'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DisplayMode } from '@/components/scoreboard/DisplayMode';

function DisplayContent() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white text-2xl text-center px-4">
        <div>
          <p className="mb-4">Parámetro matchId no encontrado</p>
          <p className="text-sm text-gray-400">Usa: /display?matchId=xxxxx</p>
        </div>
      </div>
    );
  }

  return <DisplayMode matchId={matchId} />;
}

export default function DisplayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-900 text-white text-2xl">
          Cargando...
        </div>
      }
    >
      <DisplayContent />
    </Suspense>
  );
}
