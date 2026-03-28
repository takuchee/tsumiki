import { motion, AnimatePresence } from 'framer-motion';
import { BLOCK_COLORS } from '~/features/config/block-colors';
import { useStock } from '../hooks/use-stock';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle } from '~/components/ui/card';
import { X } from 'lucide-react';

/**
 * @description ストックされた資材を表示するコンポーネント。
 * @param param0 
 * @returns 
 */
export function MaterialPalette() {
  const { materials, actions } = useStock();

  return (
    <section>
      <h2 className="text-app-label mb-4">
        Stock Palette
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {materials.map((stockTask) => {
            const color = BLOCK_COLORS[stockTask.colorName];
            return (
              <motion.div
                key={stockTask.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -100 }}
                className="group relative"
              >
                {/* 削除ボタン */}
                <Button
                  variant="outline"
                  size="icon-xs"
                  onClick={() => actions.handleDelete(stockTask.id)}
                  className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  <X />
                </Button>

                {/* 資材カード（クリックで積み上げ） */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => actions.updateStatus(stockTask.id, "completed")}
                  className="cursor-pointer block w-full"
                >
                  <Card className={cn(
                    "card-material-base",
                    color.bg,
                    color.border
                  )}>
                    <CardHeader className="p-0 space-y-0">
                      <time className={cn("text-[8px] font-black opacity-50 block mb-1", color.text)}>
                        {stockTask.date.replace(/-/g, '.')}
                      </time>
                      <CardTitle className={cn("text-[11px] font-black truncate", color.text)}>
                        {stockTask.content}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 資材が空の時の表示 */}
      {materials.length === 0 && (
        <div className="empty-area">
          <p className="text-app-label-light">
            No Stock
          </p>
        </div>
      )}
    </section>
  );
}