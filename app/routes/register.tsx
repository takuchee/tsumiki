import { Toaster } from "sonner";
import { RegisterForm } from "~/features/auth/components/RegisterForm";

export default function RegisterPage() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
			<Toaster position="top-center" richColors />

			<div className="w-full max-w-md">
				<RegisterForm />
			</div>
		</div>
	);
}
