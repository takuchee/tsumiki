// app/features/auth/components/ui/auth-separator.tsx
import { Separator } from "~/components/ui/separator";

interface AuthSeparatorProps {
	children?: React.ReactNode;
}

export const AuthSeparator = ({ children }: AuthSeparatorProps) => {
	return (
		<div className="relative w-full my-4">
			<div className="absolute inset-0 flex items-center">
				<Separator />
			</div>

			{children && (
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground font-medium">
						{children}
					</span>
				</div>
			)}
		</div>
	);
};
