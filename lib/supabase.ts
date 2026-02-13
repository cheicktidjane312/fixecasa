import { createClient } from '@supabase/supabase-js';

// On vérifie que les clés sont bien là pour éviter les bugs
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Il manque les clés Supabase dans le fichier .env.local !");
}

export const supabase = createClient(supabaseUrl, supabaseKey);