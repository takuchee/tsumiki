import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react';
import { BLOCK_COLORS } from '~/features/config/block-colors'
import { useStock } from '~/features/stock/hooks/use-stock';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import type { StockTask } from '../../types';

export function StackView() {
  const { completedTasks, actions } = useStock();

  // 日付ごとにグループ化するロジック
  const groupedLogs = useMemo(() => {
    const groups: Record<string, StockTask[]> = {};
    completedTasks.forEach(task => {
      if (!groups[task.date]) groups[task.date] = [];
      groups[task.date].push(task);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [completedTasks]);

  return (
    <div className="max-w-md mx-auto py-20 flex flex-col">
      {groupedLogs.map(([date, tasks]: [string, StockTask[]]) => (
        <div key={date} className="flex flex-col mb-16 relative">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Separator className="flex-1 bg-white/30" />
            <span className="text-[12px] font-black text-white drop-shadow-sm uppercase tracking-[0.2em]">{date
            }</span>
            <Separator className="flex-1 bg-white/30" />
          </div>
          <div className="flex flex-col -space-y-[1.5rem]">
            <AnimatePresence initial={false}>
              {tasks.map((task: StockTask) => {
                const color = BLOCK_COLORS[task.colorName]
                return (
                  <motion.button
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 200 }}
                    onClick={() => actions.updateStatus(task.id, "pending")}
                    className="relative group cursor-pointer w-full">

                    <div className={cn(
                      "relative min-h-[70px] px-6 py-6 flex flex-col justify-center items-center text-center transition-all",
                      "rounded-b-[1.2rem] rounded-t-[1.5rem]",
                      "border-x-2 border-t-2 border-b-[4px]",
                      color.bg,
                      color.border,
                      color.shadow,
                      "shadow-md",
                      "group-hover:-translate-y-[6px] group-hover:border-b-[6px] group-hover:shadow-lg",
                      "group-active:translate-y-[2px] group-active:border-b-[2px] group-active:shadow-sm"
                    )}>
                      <p className={cn(
                        "font-black text-xl leading-tight relative z-10 tracking-tight",
                        color.text
                      )}>{task.content}</p>
                    </div>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  )
}