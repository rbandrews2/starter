import { createClient } from '@supabase/supabase-js';

// Prefer environment variables, but fall back to hard-coded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://ebzfbuqclkumncnugbvq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_KC0wGmWJTmeMJ7tpvKwxAg_Oo_cXZNF';

export const supabase = createClient(supabaseUrl, supabaseKey);
