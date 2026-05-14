// src/lib/supabase.ts
// Lightweight Supabase browser client for client-side components.
// NOTE: For server components/routes, prefer the helpers under `src/lib/supabase/*`.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Avoid throwing at import time; some pages/components may render without env configured.
// Consumers should still expect runtime failures if they call Supabase without env.
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
