import { Link } from "react-router";
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
import { AuthSeparator } from "./ui/auth-separator";
import { SocialButtons } from "./ui/social-buttons";

export const LoginForm = () => {
	return (
		<div className={cn("flex flex-col gap-6")}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle>Login</CardTitle>
					<CardDescription>ログインフォーム</CardDescription>
				</CardHeader>

				<CardContent>
					<form id="login-form">
						<FieldGroup>
							<Field>
								<FieldLabel>
									<Input placeholder="Email" />
								</FieldLabel>
							</Field>
							<Field>
								<FieldLabel>
									<Input placeholder="Password" type="password" />
								</FieldLabel>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>

				<CardFooter className="flex flex-col gap-4">
					<Button className="w-full" type="submit" form="login-form">
						ログイン
					</Button>

					<AuthSeparator>または</AuthSeparator>

					<SocialButtons />

					<Button variant="link" size="sm" className="w-full" asChild>
						<Link to="/register">アカウントをお持ちでない方はこちら</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};
