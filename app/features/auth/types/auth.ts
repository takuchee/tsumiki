import { z } from "zod";

// スキーマ定義
export const loginSchema = z.object({
	email: z.email({ message: "メールアドレスの形式で入力してください" }),
	password: z
		.string()
		.min(1, { message: "パスワードは必須です" })
		.min(8, { message: "パスワードは8文字以上で入力してください" }),
});
export const registerSchema = loginSchema
	.extend({
		confirmPassword: z
			.string()
			.min(1, { message: "確認用パスワードは必須です" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "パスワードと確認用パスワードが一致しません",
		path: ["confirmPassword"],
	});

// 型定義
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
