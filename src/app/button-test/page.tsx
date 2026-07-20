'use client';

import { useEffect, useState } from 'react';

interface KeyEvent {
  key: string;
  code: string;
  keyCode: number;
  time: string;
  delta: number | null;
}

export default function ButtonTestPage() {
  const [events, setEvents] = useState<KeyEvent[]>([]);
  const [lastTime, setLastTime] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const now = Date.now();
      const entry: KeyEvent = {
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        time: new Date(now).toLocaleTimeString('es-MX', { hour12: false }),
        delta: lastTime ? now - lastTime : null,
      };
      setLastTime(now);
      setEvents((prev) => [entry, ...prev].slice(0, 20));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastTime]);

  const latest = events[0];

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-900 p-6 text-white">
      <h1 className="mb-2 text-3xl font-bold">🔧 Diagnóstico de Botón</h1>
      <p className="mb-8 text-center text-gray-400">
        Presiona tu botón Bluetooth (pastón) ahora. Cada pulsación aparecerá abajo.
      </p>

      <div className="mb-8 w-full max-w-md rounded-lg bg-gray-800 p-6 text-center">
        {latest ? (
          <>
            <p className="text-sm text-gray-400">Última tecla detectada:</p>
            <p className="text-5xl font-bold text-green-400">{latest.key}</p>
            <p className="mt-2 text-lg text-gray-300">code: {latest.code}</p>
            <p className="text-lg text-gray-300">keyCode: {latest.keyCode}</p>
          </>
        ) : (
          <p className="text-xl text-gray-500">Esperando pulsación...</p>
        )}
      </div>

      <div className="w-full max-w-md">
        <div className="mb-2 flex justify-between text-sm text-gray-400">
          <span>Historial (más reciente arriba)</span>
          <button
            onClick={() => {
              setEvents([]);
              setLastTime(null);
            }}
            className="rounded bg-gray-700 px-3 py-1 hover:bg-gray-600"
          >
            Limpiar
          </button>
        </div>
        <div className="space-y-1">
          {events.map((ev, i) => (
            <div
              key={i}
              className="flex justify-between rounded bg-gray-800 px-3 py-2 text-sm"
            >
              <span className="font-mono">
                key=&quot;{ev.key}&quot; code={ev.code} keyCode={ev.keyCode}
              </span>
              <span className="text-gray-500">
                {ev.time} {ev.delta !== null && `(+${ev.delta}ms)`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <a href="/" className="mt-8 text-blue-400 underline">
        ← Volver al marcador
      </a>
    </div>
  );
}
