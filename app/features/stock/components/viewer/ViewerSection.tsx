import { motion } from "framer-motion";
import { useStock } from "~/features/stock/hooks/use-stock";
import { StackView } from "./StackView";

export function ViewerSection() {
	// StockSectionと同じフックを参照して、同期したデータを取得
	const { totalPoints } = useStock();

	return (
		<>
			{/* スコア表示（合計ポイント） */}
			<div className="absolute top-6 right-6 z-50">
				<motion.div
					key={totalPoints}
					initial={{ scale: 1.2 }}
					animate={{ scale: 1 }}
					className="card-score-float"
				>
					<span className="text-app-label">Blocks</span>
					<span className="text-score-number">{totalPoints}</span>
				</motion.div>
			</div>

			{/* ブロック表示エリア */}
			<div className="viewer-main-container">
				<StackView />
			</div>
		</>
	);
}
