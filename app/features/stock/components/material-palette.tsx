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
      <h2 className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mb-4">
        Stock Palette
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {materials.map((m) => {
            const color = BLOCK_COLORS[m.block_color];
            return (
              <motion.div
                key={m.id}
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
                  onClick={() => actions.handleDelete(m.id)}
                  className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  <X />
                </Button>

                {/* 資材カード（クリックで積み上げ） */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => actions.handleStack(m.id)}
                  className="cursor-pointer block w-full"
                >
                  <Card className={cn(
                    "p-3 border-2 transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.05)]",
                    "hover:shadow-lg hover:-translate-y-0.5",
                    "active:translate-y-px",
                    color.bg,
                    color.border
                  )}>
                    <CardHeader className="p-0 space-y-0">
                      <time className={cn("text-[8px] font-black opacity-50 block mb-1", color.text)}>
                        {m.task_date.replace(/-/g, '.')}
                      </time>
                      <CardTitle className={cn("text-[11px] font-black truncate", color.text)}>
                        {m.task_name}
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
        <div className="text-center py-10 border-2 border-dashed border-sky-100 rounded-3xl">
          <p className="text-[10px] font-bold text-sky-200 uppercase tracking-widest">
            No Stock
          </p>
        </div>
      )}
    </section>
  );
}