import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wkkybfkjeqlwmdowrosn.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Jd8gyFgrdy4eL20GsGEYOg_cIhx6A79';

export const supabase = createClient(supabaseUrl, supabaseKey);
