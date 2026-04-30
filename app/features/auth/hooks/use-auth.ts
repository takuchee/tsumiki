import { useState } from "react";
import { supabase } from "~/lib/supabase";

export const useAuth = () => {
	const [isLoading, setIsLoading] = useState(false);

	/** 新規登録 */
	const signUp = async (email: string, pass: string) => {
		setIsLoading(true);
		const { data, error } = await supabase.auth.signUp({
			email,
			password: pass,
		});
		setIsLoading(false);
		if (error) throw error;
		return data;
	};

	/** ログイン */
	const signIn = async (email: string, pass: string) => {
		setIsLoading(true);
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password: pass,
		});
		setIsLoading(false);
		if (error) throw error;
		return data;
	};

	/** ソーシャルログイン */
	const signInWithSocial = async (provider: "google" | "apple") => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${window.location.origin}/auth/callback`, // TODO: まだ定義してないが後ほど実装
			},
		});
		if (error) throw error;
		return data;
	};

	return { signUp, signIn, signInWithSocial, isLoading };
};
