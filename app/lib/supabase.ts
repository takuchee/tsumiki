import { createClient } from "@supabase/supabase-js";

const getSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabaseの環境変数が設定されていません。 .env ファイルを確認してください。",
    );
  }

  return { supabaseUrl, supabaseAnonKey };
};

let cachedSupabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseServer = () => {
  if (!cachedSupabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    cachedSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return cachedSupabaseClient;
};

export const supabase = getSupabaseServer();
