import { useEffect } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import type { RegisterFormData } from "~/features/auth/types/auth";

export const useRegister = () => {
	const fetcher = useFetcher<{ error?: string }>();
	const isLoading = fetcher.state !== "idle";

	useEffect(() => {
		if (fetcher.data && "error" in fetcher.data && fetcher.data.error) {
			toast.error(fetcher.data.error);
		}
	}, [fetcher.data]);

	const onSubmit = async (data: RegisterFormData) => {
		toast.promise(
			new Promise((resolve) => {
				fetcher.submit(
					{
						email: data.email,
						password: data.password,
						intent: "email",
					},
					{ method: "post", action: "/register" },
				);
				resolve(true);
			}),
			{
				loading: "登録中...",
				success: "登録が完了しました！ログインしてください。",
				error: "新規登録に失敗しました。",
			},
		);
	};

	const handleSocialClick = (provider: "google" | "apple") => {
		fetcher.submit(
			{ provider, intent: "social" },
			{ method: "post", action: "/register" },
		);
	};

	return {
		isLoading,
		onSubmit,
		handleSocialClick,
	};
};
