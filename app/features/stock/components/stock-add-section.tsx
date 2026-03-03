import { useState } from 'react';
import { useStock } from '../hooks/use-stock';
import { StockSidebar } from './desktop/stock-sidebar';
import { StockDrawer } from './mobile/stock-drawer';
import { AnimatePresence, motion } from 'framer-motion';

export function StockAddSection({ initialLogs = [] }: any) {
  const { materials, state, actions } = useStock(initialLogs);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const commonProps = { materials, ...state, ...actions, };

  return (
    <>
      {/* PC版 */}
      <StockSidebar initialLogs={initialLogs} />

      {/* モバイル版 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <StockDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} {...commonProps} />
        )}
      </AnimatePresence>

      {/* モバイル用追加ボタン */}
      <motion.button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed bottom-8 right-8 w-16 h-16 bg-white text-sky-500 rounded-full shadow-2xl border-4 border-sky-400 flex items-center justify-center text-3xl font-black z-[60]"
      >
        ＋
      </motion.button>
    </>
  );
}