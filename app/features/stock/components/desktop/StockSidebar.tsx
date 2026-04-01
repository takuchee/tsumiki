import { ScrollArea } from "~/components/ui/scroll-area";
import { MaterialPalette } from "../MaterialPalette";
import { StockForm } from "../StockForm";

/**
 * @description デスクトップ画面用のコンポーネント。
 */
export function StockSidebar() {
	return (
		<aside className="sidebar-container">
			<header className="mb-8 shrink-0">
				<h1 className="text-logo-main">積み記</h1>
			</header>

			<div className="mb-8 shrink-0">
				<StockForm />
			</div>

			<div className="scroll-area-container -mr-4">
				<ScrollArea className="h-full pr-0">
					<MaterialPalette />
				</ScrollArea>
			</div>
		</aside>
	);
}
