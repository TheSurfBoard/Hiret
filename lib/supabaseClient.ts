import { createClient } from '@supabase/supabase-js';

// .env.local nunchi keys ni laguthunnam
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase Connection create chesthunnam
export const supabase = createClient(supabaseUrl, supabaseKey);