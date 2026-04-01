import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { Separator } from "~/components/ui/separator";
import { BLOCK_COLORS } from "~/features/config/block-colors";
import { useStock } from "~/features/stock/hooks/use-stock";
import { cn } from "~/lib/utils";
import type { StockTask } from "../../types";

export function StackView() {
	const { completedTasks, actions } = useStock();

	const groupedLogs = useMemo(() => {
		const groups: Record<string, StockTask[]> = {};
		completedTasks.forEach((task) => {
			if (!groups[task.date]) groups[task.date] = [];
			groups[task.date].push(task);
		});
		return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
	}, [completedTasks]);

	return (
		<div className="max-w-md mx-auto py-20 flex flex-col">
			{groupedLogs.map(([date, tasks]) => (
				<div key={date} className="flex flex-col mb-16 relative">
					{/* 日付ヘッダー */}
					<div className="flex items-center justify-center gap-4 mb-8">
						<Separator className="flex-1 bg-white/30" />
						<span className="text-date-separator">{date}</span>
						<Separator className="flex-1 bg-white/30" />
					</div>

					{/* ブロックの積み上げエリア */}
					<div className="flex flex-col -space-y-[1.5rem]">
						<AnimatePresence initial={false}>
							{tasks.map((task) => {
								const color = BLOCK_COLORS[task.colorName];
								return (
									<motion.button
										key={task.id}
										layout
										initial={{ opacity: 0, y: -50 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, x: 200 }}
										onClick={() => actions.updateStatus(task.id, "pending")}
										className="relative group cursor-pointer w-full"
									>
										<div
											className={cn("ui-block-stacked", color.bg, color.border)}
										>
											<p
												className={cn(
													"font-black text-xl leading-tight relative z-10 tracking-tight",
													color.text,
												)}
											>
												{task.content}
											</p>
										</div>
									</motion.button>
								);
							})}
						</AnimatePresence>
					</div>
				</div>
			))}
		</div>
	);
}
