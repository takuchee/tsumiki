import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
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
		try {
			await signIn(data.email, data.password);
			// ログイン成功時に /stock へ遷移
			window.location.href = "/"; // ここは navigate("/") ではなく、リロードしてユーザーデータを確実に反映させるために location.href を使用
		} catch (err) {
			// 後のステップでここにトースター（通知）を実装します
			console.error("ログイン失敗:", err);
		}
	};

	const handleSocialClick = async (provider: "google" | "apple") => {
		try {
			await signInWithSocial(provider);
			// ソーシャルログイン成功時も /stock へ
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
