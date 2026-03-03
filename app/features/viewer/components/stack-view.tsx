import { motion, AnimatePresence } from 'framer-motion'
import { BLOCK_COLORS } from '~/features/config/block-colors'

export function StackView({ groupedLogs, onUnstack }: any) {
  return (
    <div className="max-w-md mx-auto py-20 flex flex-col">
      {groupedLogs.map(([date, tasks]: any) => (
        <div key={date} className="flex flex-col mb-16 relative">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-0.5 w-8 bg-white/30 rounded-full" />
            <span className="text-[12px] font-black text-white drop-shadow-sm uppercase tracking-[0.2em]">{date.replace(/-/g, ' . ')}</span>
            <div className="h-0.5 w-8 bg-white/30 rounded-full" />
          </div>
          <div className="flex flex-col -space-y-[1.5rem]">
            <AnimatePresence initial={false}>
              {tasks.map((log: any) => {
                const color = BLOCK_COLORS[log.colorIdx]
                return (
                  <motion.button key={log.id} layout initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 200 }} onClick={() => onUnstack(log.id)} className="relative group cursor-pointer w-full">
                    <div className={`relative ${color.bg} border-x-2 ${color.border} px-6 py-6 min-h-[90px] rounded-t-[2.5rem] rounded-b-[1.2rem] shadow-[inset_0_4px_0_rgba(255,255,255,0.4),0_20px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-center items-center text-center transition-all`}>
                      <div className={`absolute bottom-0 left-0 w-full h-4 ${color.shadow} rounded-b-[1.2rem] border-t border-black/10`} />
                      <p className={`font-black text-xl leading-tight drop-shadow-sm ${color.text} relative z-10 uppercase tracking-tight`}>{log.content}</p>
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