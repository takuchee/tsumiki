import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { type RegisterFormData, registerSchema } from "../types/auth";
import { AuthSeparator } from "./ui/auth-separator";
import { SocialButtons } from "./ui/social-buttons";

export const RegisterForm = () => {
	const fetcher = useFetcher<{ error?: string }>();
	const isLoading = fetcher.state !== "idle";

	// トーストのローディングIDを保持するための参照
	const toastIdRef = useRef<string | number | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		mode: "onBlur",
	});

	// 💡 【ここが集約場所】サーバーの通信状態（fetcher）を監視して、トースターを完璧に制御する
	useEffect(() => {
		// A. サーバーへ送信中のとき ➔ ローディングを表示
		if (fetcher.state === "submitting" || fetcher.state === "loading") {
			if (!toastIdRef.current) {
				toastIdRef.current = toast.loading("登録中...");
			}
		}

		// B. サーバーからの返却（完了）があったとき
		if (fetcher.state === "idle" && fetcher.data) {
			// 既存のローディングトーストを消す
			if (toastIdRef.current) {
				toast.dismiss(toastIdRef.current);
				toastIdRef.current = null;
			}

			// サーバー側でエラーが返ってきた場合
			if (fetcher.data.error) {
				toast.error(fetcher.data.error);
			} else {
				// エラーがない ➔ 新規登録成功（リダイレクトされる前のハッピーパス）
				toast.success("登録が完了しました！ログインしてください。");
			}
		}
	}, [fetcher.state, fetcher.data]);

	// 💡 送信時は「ただ投げるだけ」。ややこしい非同期ロジックはここには一切書かない！
	const onSubmit = (data: RegisterFormData) => {
		fetcher.submit(
			{ email: data.email, password: data.password, intent: "email" },
			{ method: "post", action: "/register" },
		);
	};

	const handleSocialClick = (provider: "google" | "apple") => {
		fetcher.submit(
			{ provider, intent: "social" },
			{ method: "post", action: "/register" },
		);
	};

	return (
		<div className={cn("flex flex-col gap-6")}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle>Register</CardTitle>
					<CardDescription>新規登録</CardDescription>
				</CardHeader>
				<CardContent>
					<form id="register-form" onSubmit={handleSubmit(onSubmit)}>
						<FieldGroup>
							<Field>
								<FieldLabel>メールアドレス</FieldLabel>
								<Input
									{...register("email")}
									className={cn(
										errors.email &&
											"bg-red-100 border-red-300 focus-visible:ring-red-500",
									)}
									disabled={isLoading}
								/>
								{errors.email && (
									<p className="text-red-500 text-sm mt-1">
										{errors.email.message}
									</p>
								)}
							</Field>

							<Field>
								<FieldLabel>パスワード</FieldLabel>
								<Input
									type="password"
									{...register("password")}
									className={cn(
										errors.password &&
											"bg-red-100 border-red-300 focus-visible:ring-red-500",
									)}
									disabled={isLoading}
								/>
								{errors.password && (
									<p className="text-red-500 text-sm mt-1">
										{errors.password.message}
									</p>
								)}
							</Field>

							<Field>
								<FieldLabel>確認用パスワード</FieldLabel>
								<Input
									type="password"
									{...register("confirmPassword")}
									className={cn(
										errors.confirmPassword &&
											"bg-red-100 border-red-300 focus-visible:ring-red-500",
									)}
									disabled={isLoading}
								/>
								{errors.confirmPassword && (
									<p className="text-red-500 text-sm mt-1">
										{errors.confirmPassword.message}
									</p>
								)}
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button
						className="w-full"
						type="submit"
						form="register-form"
						disabled={isLoading}
					>
						{isLoading ? "登録中..." : "新規登録"}
					</Button>
					<AuthSeparator>または</AuthSeparator>
					<SocialButtons onSocialClick={handleSocialClick} />
					<Button variant="link" size="sm" className="w-full" asChild>
						<Link to="/login">アカウントをお持ちの方はこちら</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};
