// 📄 app/features/auth/actions/register-action.ts
import { type ActionFunctionArgs, redirect } from "react-router";
import { createSupabaseServerClient } from "~/lib/supabase.";
import { registerSchema } from "../types/auth";

export const registerAction = async ({ request }: ActionFunctionArgs) => {
	const headers = new Headers();
	const supabase = createSupabaseServerClient(request, headers);

	const formData = await request.formData();
	const intent = formData.get("intent");

	try {
		// 💡 通常のEメール新規登録の処理
		if (intent === "email") {
			const rawData = Object.fromEntries(formData);

			// 🛡️ サーバーサイドの Zod バリデーション
			const result = registerSchema.safeParse(rawData);
			if (!result.success) {
				const firstError =
					result.error?.message || "入力内容に不備があります。";
				return Response.json({ error: firstError }, { status: 400 });
			}

			const { email, password } = result.data;

			// 🚀 Supabase でアカウント作成！
			const { error } = await supabase.auth.signUp({ email, password });

			if (error) {
				if (error.status === 400 && error.message.includes("already exists")) {
					return Response.json({
						error: "このメールアドレスは既に登録されています。",
					});
				}
				return Response.json({ error: error.message });
			}

			// ✨ 成功したらログイン画面へ安全にリリダイレクト
			return redirect("/login", { headers });
		}

		return Response.json({ error: "不正なリクエストです。" }, { status: 400 });
	} catch (error: any) {
		console.error("Register action error:", error);
		return Response.json(
			{ error: error.message || "新規登録エラーが発生しました。" },
			{ status: 500 },
		);
	}
};
