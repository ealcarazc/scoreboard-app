'use client';

import { useTactile } from '@/lib/hooks/useTactile';

export default function TestFeedback() {
  const { vibrate, playBeep, pointFeedback } = useTactile();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-900 p-6 text-white">
      <h1 className="text-4xl font-bold">Test Feedback</h1>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => vibrate(50)}
          className="rounded bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700 active:scale-95"
        >
          Test Vibration (50ms)
        </button>

        <button
          onClick={() => playBeep(200, 100)}
          className="rounded bg-green-600 px-6 py-3 font-bold hover:bg-green-700 active:scale-95"
        >
          Test Beep (200Hz, 100ms)
        </button>

        <button
          onClick={() => pointFeedback()}
          className="rounded bg-purple-600 px-6 py-3 font-bold hover:bg-purple-700 active:scale-95"
        >
          Test Point Feedback (Vibrate + Beep)
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Note: Vibration requires a mobile device. Audio should work in all browsers after clicking a button.
        </p>
      </div>
    </div>
  );
}
