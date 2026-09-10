import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Used only for Realtime "broadcast" channels (the phone-as-remote feature).
// No database tables or auth involved.
export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        realtime: { params: { eventsPerSecond: 20 } },
        auth: { persistSession: false },
      })
    : null;

export function isRealtimeConfigured(): boolean {
  return !!supabase;
}
