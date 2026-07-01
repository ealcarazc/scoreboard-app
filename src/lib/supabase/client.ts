// Supabase client disabled - using sessionStorage only
export const supabase = {
  from: (table: string) => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    insert: () => Promise.resolve({ data: null, error: null }),
  }),
  channel: (name: string) => ({
    on: () => ({ subscribe: () => {} }),
  }),
  removeChannel: () => {},
} as any;
