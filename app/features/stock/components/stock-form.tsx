import { useRef } from 'react'
import { BLOCK_COLORS } from '~/features/config/block-colors'

/**
 * 
 * @description ブロックをストックするためのフォームコンポーネント。資材名、日付、ブロックの色を選択して追加できる。
 * @param param0 
 * @returns 
 */
export function StockForm({
  onAdd, targetDate, setTargetDate,
  selectedColorIdx, setSelectedColorIdx
}: any) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    const val = inputRef.current?.value || ""
    if (!val.trim()) return
    onAdd(val)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="bg-sky-50/50 p-5 rounded-3xl space-y-5 border-b-4 border-sky-100">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1">What to build?</label>
        <input
          ref={inputRef}
          onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleAdd()}
          placeholder="資材名..."
          className="w-full bg-transparent text-lg font-bold focus:outline-none placeholder:text-sky-200 border-none outline-none p-0"
        />
      </div>
      <div className="flex items-center justify-between border-t border-sky-100 pt-4">
        <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="bg-transparent text-xs font-bold focus:outline-none text-sky-600" />
        <div className="flex gap-1.5">
          {BLOCK_COLORS.map((c: any) => (
            <button
              key={c.id}
              onClick={() => setSelectedColorIdx(c.id)}
              className={`w-5 h-5 rounded-full border-2 ${c.bg} ${selectedColorIdx === c.id ? 'border-sky-600 scale-125' : 'border-white'} transition-transform`}
            />
          ))}
        </div>
      </div>
      <button onClick={handleAdd} className="w-full bg-sky-500 text-white py-3 rounded-2xl text-xs font-black hover:bg-sky-600 transition-all shadow-[0_4px_0_0_rgba(14,165,233,0.3)] active:translate-y-1 active:shadow-none">
        ストックする
      </button>
    </div>
  )
}