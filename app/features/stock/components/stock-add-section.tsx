import { useState } from 'react';
import { StockSidebar } from './desktop/stock-sidebar';
import { StockDrawer } from './mobile/stock-drawer';
import { AnimatePresence } from 'framer-motion';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export function StockAddSection() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* PC版 */}
      <StockSidebar />

      {/* モバイル版 */}
      {isMobileMenuOpen && (
        <StockDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      )}

      {/* モバイル用追加ボタン */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsMobileMenuOpen(true)}
        className={cn(
          "md:hidden fixed bottom-8 right-8 w-16 h-16 z-[60]",
          "bg-white text-primary rounded-full border-4 border-primary/40",
          "text-3xl font-black shadow-block active:translate-y-1 active:shadow-none transition-all",
          isMobileMenuOpen ? "opacity-0 pointer-events-none scale-0" : "opacity-100 scale-100"
        )}
      >
        ＋
      </Button>
    </>
  );
}