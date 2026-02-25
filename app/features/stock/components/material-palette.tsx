import { motion, AnimatePresence } from 'framer-motion';

interface Material {
  id: string;
  content: string;
  date: string;
  colorIdx: number;
}

interface MaterialPaletteProps {
  materials: Material[];
  onStack: (id: string) => void;
  onDelete: (id: string) => void;
  BLOCK_COLORS: any[];
}

/**
 * @description ストックされた資材を表示するコンポーネント。
 * @param param0 
 * @returns 
 */
export function MaterialPalette({
  materials,
  onStack,
  onDelete,
  BLOCK_COLORS
}: MaterialPaletteProps) {
  return (
    <section>
      <h2 className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mb-4">
        Stock Palette
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {materials.map((m) => {
            const color = BLOCK_COLORS[m.colorIdx];
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
                <button
                  onClick={() => onDelete(m.id)}
                  className="absolute -top-2 -left-2 w-6 h-6 bg-white border-2 border-sky-100 rounded-full flex items-center justify-center text-sky-300 opacity-0 group-hover:opacity-100 hover:text-rose-500 z-30 transition-all shadow-sm"
                >
                  ×
                </button>

                {/* 資材カード（クリックで積み上げ） */}
                <button
                  onClick={() => onStack(m.id)}
                  className={`w-full p-3 rounded-xl border-2 ${color.border} ${color.bg} shadow-[0_4px_0_0_rgba(0,0,0,0.05)] text-left overflow-hidden active:translate-y-0.5 active:shadow-none transition-all`}
                >
                  <span className="text-[8px] font-black opacity-50 block mb-1 text-sky-900">
                    {m.date.replace(/-/g, '.')}
                  </span>
                  <span className={`block truncate text-[11px] font-black ${color.text}`}>
                    {m.content}
                  </span>
                </button>
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