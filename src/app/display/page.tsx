'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DisplayMode } from '@/components/scoreboard/DisplayMode';

function DisplayContent() {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white text-2xl text-center px-4">
        <div>
          <p className="mb-4">No hay datos de marcador</p>
          <p className="text-sm text-gray-400">Abre el display desde el app de control</p>
        </div>
      </div>
    );
  }

  return <DisplayMode data={data} />;
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
