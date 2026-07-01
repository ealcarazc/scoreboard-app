// Supabase client disabled - using sessionStorage only
export const supabase = {
  from: () => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    insert: () => Promise.resolve({ data: null, error: null }),
  }),
  channel: () => ({
    on: () => ({ subscribe: () => {} }),
  }),
  removeChannel: () => {},
};
