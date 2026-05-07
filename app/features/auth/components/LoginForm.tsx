import { zodResolver } from "@hookform/resolvers/zod";
import { isAuthApiError } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
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
import { useAuth } from "../hooks/use-auth";
import { type LoginFormData, loginSchema } from "../types/auth";
import { AuthSeparator } from "./ui/auth-separator";
import { SocialButtons } from "./ui/social-buttons";

export const LoginForm = () => {
	const navigate = useNavigate();
	const { signIn, signInWithSocial, isLoading } = useAuth();

	// 1. Hook Form の設定
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur",
	});

	// 2. ログイン実行
	const onSubmit = async (data: LoginFormData) => {
		const signInPromise = signIn(data.email, data.password);
		toast.promise(signInPromise, {
			loading: "ログイン中...",
			success: () => {
				setTimeout(() => {
					window.location.href = "/";
				}, 1000);
				return `${data.email}さんおかえりなさい！一緒に積み上げていきましょう！`;
			},
			error: (err) => {
				if (!isAuthApiError(err)) {
					return "ログインに失敗しました。再度お試しください。";
				}
				if (err.code === "invalid_credentials") {
					return "メールアドレスまたはパスワードが間違っています。";
				}
				return err.message;
			},
		});
	};

	const handleSocialClick = async (provider: "google" | "apple") => {
		try {
			await signInWithSocial(provider);
			navigate("/");
		} catch (err) {
			console.error("ソーシャルログイン失敗:", err);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6")}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle>Login</CardTitle>
					<CardDescription>ログインフォーム</CardDescription>
				</CardHeader>

				<CardContent>
					{/* handleSubmit を使用 */}
					<form id="login-form" onSubmit={handleSubmit(onSubmit)}>
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
						</FieldGroup>
					</form>
				</CardContent>

				<CardFooter className="flex flex-col gap-4">
					<Button
						className="w-full"
						type="submit"
						form="login-form"
						disabled={isLoading}
					>
						{isLoading ? "ログイン中..." : "ログイン"}
					</Button>

					<AuthSeparator>または</AuthSeparator>

					<SocialButtons onSocialClick={handleSocialClick} />

					<Button variant="link" size="sm" className="w-full" asChild>
						<Link to="/register">アカウントをお持ちでない方はこちら</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};
