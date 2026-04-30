import { LoginForm } from "~/features/auth/components/LoginForm";

export default function LoginPage() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
			<div className="w-full max-w-md">
				<LoginForm />
			</div>
		</div>
	);
}
