import { type ActionFunctionArgs, redirect } from "react-router";
import { createSupabaseServerClient } from "~/lib/supabase.";
import { loginSchema } from "../types/auth";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
	const headers = new Headers();
	const supabase = createSupabaseServerClient(request, headers);

	const formData = await request.formData();
	const intent = formData.get("intent");

	try {
		// 💡 ソーシャルログインの処理
		if (intent === "social") {
			const provider = formData.get("provider") as "google" | "apple";
			if (!provider) throw new Error("プロバイダーが指定されていません。");

			const { data, error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${new URL(request.url).origin}/auth/callback`,
				},
			});

			if (error) throw error;
			if (data.url) return redirect(data.url, { headers });
		}

		// 💡 通常のEメールログインの処理
		if (intent === "email") {
			const rawData = Object.fromEntries(formData);
			const result = loginSchema.safeParse(rawData);

			if (!result.success) {
				const firstError = result.error.message || "入力内容に不備があります。";
				return Response.json({ error: firstError }, { status: 400 });
			}

			const { email, password } = result.data;
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				if (error.status === 400) {
					return Response.json({
						error: "メールアドレスまたはパスワードが間違っています。",
					});
				}
				return Response.json({ error: error.message });
			}

			return redirect("/", { headers });
		}

		return Response.json({ error: "不正なリクエストです。" }, { status: 400 });
	} catch (error: any) {
		console.error("Login action error:", error);
		return Response.json(
			{ error: error.message || "認証エラーが発生しました。" },
			{ status: 500 },
		);
	}
};
