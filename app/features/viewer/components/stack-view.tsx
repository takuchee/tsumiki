import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react';
import { BLOCK_COLORS } from '~/features/config/block-colors'
import { useStock } from '~/features/stock/hooks/use-stock';
import type { TaskLog } from '~/features/stock/types';
import { cn } from '~/lib/utils';
import { Separator } from '~/components/ui/separator';

export function StackView() {
  const { completedTasks, actions } = useStock();

  // 日付ごとにグループ化するロジック
  // TODO ここきれいにしたい非常に読みにくい
  const groupedLogs = useMemo(() => {
    const groups: { [key: string]: TaskLog[] } = {};
    completedTasks.forEach(task => {
      if (!groups[task.task_date]) groups[task.task_date] = [];
      groups[task.task_date].push(task);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [completedTasks]);

  return (
    <div className="max-w-md mx-auto py-20 flex flex-col">
      {groupedLogs.map(([date, tasks]: [string, TaskLog[]]) => (
        <div key={date} className="flex flex-col mb-16 relative">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Separator className="flex-1 bg-white/30" />
            <span className="text-[12px] font-black text-white drop-shadow-sm uppercase tracking-[0.2em]">{date.replace(/-/g, ' . ')}</span>
            <Separator className="flex-1 bg-white/30" />
          </div>
          <div className="flex flex-col -space-y-[1.5rem]">
            <AnimatePresence initial={false}>
              {tasks.map((log: TaskLog) => {
                const color = BLOCK_COLORS[log.block_color]
                return (
                  <motion.button
                    key={log.id}
                    layout
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 200 }}
                    onClick={() => actions.handleUnstack(log.id)}
                    className="relative group cursor-pointer w-full">
                    <div className={`relative ${color.bg} border-x-2 ${color.border} px-6 py-6 min-h-[90px] rounded-t-[2.5rem] rounded-b-[1.2rem] shadow-[inset_0_4px_0_rgba(255,255,255,0.4),0_20px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-center items-center text-center transition-all`}>
                      <div className={`absolute bottom-0 left-0 w-full h-4 ${color.shadow} rounded-b-[1.2rem] border-t border-black/10`} />
                      <p className={`font-black text-xl leading-tight drop-shadow-sm ${color.text} relative z-10 uppercase tracking-tight`}>{log.task_name}</p>
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