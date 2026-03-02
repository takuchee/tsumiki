import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// 1. 環境変数の取得（クライアント側は import.meta.env、サーバー側は process.env）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 安全チェック：変数が空ならここでエラーを投げる（原因を特定しやすくするため）
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabaseの環境変数が設定されていません。 .env ファイルを確認してください。",
  );
}

// 2. クライアント側（ブラウザ）用
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// 3. サーバー側（loader）用
export const getSupabaseServer = () =>
  createSupabaseClient(supabaseUrl, supabaseAnonKey);
