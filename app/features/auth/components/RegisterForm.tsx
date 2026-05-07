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
import { type RegisterFormData, registerSchema } from "../types/auth";
import { AuthSeparator } from "./ui/auth-separator";
import { SocialButtons } from "./ui/social-buttons";

export const RegisterForm = () => {
	// Eメールとパスワード、確認用パスワードのuseRef
	const navigate = useNavigate();
	const { signUp, signInWithSocial, isLoading } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		mode: "onBlur",
	});

	const onSubmit = async (data: RegisterFormData) => {
		const signUpPromise = signUp(data.email, data.password);
		toast.promise(signUpPromise, {
			loading: "登録中...",
			success: "登録が完了しました！ログインしてください。",
			error: (err) => {
				if (!isAuthApiError(err)) {
					return "新規登録に失敗しました。再度お試しください。";
				}
				if (err.code === "user_already_exists") {
					return "このメールアドレスは既に登録されています。ログインしてください。";
				}
				return err.message;
			},
		});
	};

	const handleSocialClick = async (provider: "google" | "apple") => {
		try {
			await signInWithSocial(provider);
		} catch (err) {
			console.error("ソーシャル登録に失敗しました:", err);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6")}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle>register</CardTitle>
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
