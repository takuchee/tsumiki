import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { StockSidebar } from "./desktop/StockSidebar";
import { StockDrawer } from "./mobile/StockDrawer";

export function StockAddSection() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<>
			{/* PC版 */}
			<StockSidebar />

			{/* モバイル版 */}
			{isMobileMenuOpen && (
				<StockDrawer
					isOpen={isMobileMenuOpen}
					onClose={() => setIsMobileMenuOpen(false)}
				/>
			)}

			{/* モバイル用追加ボタン */}
			<Button
				variant="outline"
				size="icon"
				onClick={() => setIsMobileMenuOpen(true)}
				className={cn("btn-float-add", isMobileMenuOpen && "btn-float-hidden")}
			>
				＋
			</Button>
		</>
	);
}
