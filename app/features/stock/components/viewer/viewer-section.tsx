import { motion } from 'framer-motion';
import { useStock } from '~/features/stock/hooks/use-stock';
import { StackView } from './stack-view';
import { useMemo } from 'react'

export function ViewerSection() {
  // StockSectionと同じフックを参照して、同期したデータを取得
  const { totalPoints } = useStock();

  return (
    <>
      {/* スコア表示（合計ポイント） */}
      <div className="absolute top-6 right-6 z-50">
        <motion.div
          key={totalPoints}
          initial={{ scale: 1.2 }} animate={{ scale: 1 }}
          className="bg-white/90 backdrop-blur border-4 border-sky-600 p-3 rounded-2xl shadow-xl flex flex-col items-center"
        >
          <span className="text-[10px] font-black text-sky-600 uppercase">Blocks</span>
          <span className="text-3xl font-black text-sky-600">{totalPoints}</span>
        </motion.div>
      </div>

      {/* ブロック表示エリア */}
      <div className="flex-1 overflow-y-auto p-6 md:px-20 z-10 scrollbar-hide">
        <StackView />
      </div>
    </>
  );
}