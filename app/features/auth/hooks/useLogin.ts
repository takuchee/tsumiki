import { useEffect } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import type { LoginFormData } from "~/features/auth/types/auth";

export const useLogin = () => {
	const fetcher = useFetcher<{ error?: string }>();
	const isLoading = fetcher.state !== "idle";

	useEffect(() => {
		if (fetcher.data && "error" in fetcher.data && fetcher.data.error) {
			toast.error(fetcher.data.error);
		}
	}, [fetcher.data]);

	const onSubmit = async (data: LoginFormData) => {
		toast.promise(
			new Promise((resolve, _) => {
				fetcher.submit(
					{
						email: data.email,
						password: data.password,
						intent: "email",
					},
					{ method: "post", action: "/login" },
				);
				resolve(true);
			}),
			{
				loading: "ログイン中...",
				success: () => {
					return `${data.email}さんおかえりなさい！一緒に積み上げていきましょう！`;
				},
				error: "ログインに失敗しました。",
			},
		);
	};

	const handleSocialClick = (provider: "google" | "apple") => {
		fetcher.submit(
			{ provider, intent: "social" },
			{ method: "post", action: "/login" },
		);
	};

	return {
		isLoading,
		onSubmit,
		handleSocialClick,
	};
};
