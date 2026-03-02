import { motion } from 'framer-motion'
import { StockForm } from '../stock-form'
import { MaterialPalette } from '../material-palette' // ★追加

/**
 * @description モバイル画面用ののコンポーネント。ストックの追加フォームと資材パレットを表示するドロワーを表示。
 * @param param0 
 * @returns 
 */
export function StockDrawer({ isOpen, onClose, ...commonProps }: any) {
  return (
    <>
      {/* 背景オーバーレイ */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-sky-900/40 backdrop-blur-sm z-40 md:hidden"
      />

      {/* ドロワー本体 */}
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 inset-x-0 h-[85vh] bg-white rounded-t-[3rem] p-8 z-50 shadow-2xl md:hidden flex flex-col"
      >
        {/* 引き手バー */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 flex-shrink-0" onClick={onClose} />

        {/* スクロール可能なエリア */}
        <div className="space-y-8 flex-1 overflow-y-auto pb-10 scrollbar-hide">
          <header>
            <h2 className="text-xl font-black italic text-sky-600">Material Stock</h2>
          </header>

          {/* 入力フォーム */}
          <StockForm {...commonProps} onAdd={(val: string) => { commonProps.onAdd(val); }} />

          {/* ★資材カード一覧を追加 */}
          <MaterialPalette
            materials={commonProps.materials}
            onStack={(id: string) => { commonProps.onStack(id); onClose(); }} // 積んだら閉じる
            onDelete={commonProps.onDelete}
            BLOCK_COLORS={commonProps.BLOCK_COLORS}
          />
        </div>
      </motion.div>
    </>
  )
}