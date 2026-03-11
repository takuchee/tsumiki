import { StockForm } from '../stock-form'
import { MaterialPalette } from '../material-palette'
import { useStock } from '../../hooks/use-stock'

/**
 * @description デスクトップ画面用のコンポーネント。
 *              `useStock` を内部で呼び出し、フォームとパレットに
 *              必要な props を直接渡すことで外部からのバケツリレーを排除。
 */
export function StockSidebar() {

  return (
    <aside className="hidden md:flex w-[400px] p-10 bg-white/80 backdrop-blur-xl border-r border-sky-100 flex-col z-20 shadow-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter italic text-sky-600">TSUMIKI</h1>
        <p className="text-[10px] font-black text-sky-400 mt-2 tracking-[0.2em] uppercase">Material Stock</p>
      </header>

      <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <StockForm />
        <MaterialPalette />
      </div>
    </aside>
  )
}