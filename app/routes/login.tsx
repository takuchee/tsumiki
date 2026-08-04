import type { ActionFunctionArgs } from "react-router";
import { Toaster } from "sonner";
import { loginAction } from "~/features/auth/actions/login-action";
import { LoginForm } from "~/features/auth/components/LoginForm";

export const action = async (args: ActionFunctionArgs) => {
	return await loginAction(args);
};

export default function LoginPage() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
			<Toaster position="top-center" richColors />

			<div className="w-full max-w-md">
				<LoginForm />
			</div>
		</div>
	);
}
