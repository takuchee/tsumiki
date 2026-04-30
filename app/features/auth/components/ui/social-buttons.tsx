import { FcGoogle } from "react-icons/fc";
import { SiApple } from "react-icons/si";
import { Button } from "~/components/ui/button";

export const SocialButtons = ({
	onSocialClick,
}: {
	onSocialClick: (provider: "google" | "apple") => void;
}) => {
	return (
		<div className="flex items-center justify-center gap-6 py-2">
			<Button
				variant="outline"
				size="icon"
				type="button"
				className="rounded-full shadow-sm hover:bg-slate-50 transition-all"
				onClick={() => onSocialClick("google")}
			>
				<FcGoogle className="h-5 w-5" />
				<span className="sr-only">Googleでログイン</span>
			</Button>
			<Button
				variant="outline"
				size="icon"
				type="button"
				className="rounded-full shadow-sm hover:bg-slate-50 transition-all"
				onClick={() => onSocialClick("apple")}
			>
				<SiApple className="h-5 w-5" />
				<span className="sr-only">Appleでログイン</span>
			</Button>
		</div>
	);
};
