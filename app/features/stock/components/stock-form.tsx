import { useRef } from 'react'
import { BLOCK_COLORS } from '~/features/config/block-colors'
import { useStock } from '../hooks/use-stock';
import { useStockContext } from '../stores/stock-store';
import type { ColorName } from '../types';
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Calendar } from '~/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { format } from 'date-fns';

/**
 *
 * @description ブロックをストックするためのフォームコンポーネント。資材名、日付、ブロックの色を選択して追加できる。
 */
export function StockForm() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { actions } = useStock();
  const { targetDate, setTargetDate, selectedColor, setSelectedColor } = useStockContext();

  const handleAdd = () => {
    const val = inputRef.current?.value || ""
    if (!val.trim()) return
    actions.handleAdd(val)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="bg-sky-50/50 p-5 rounded-3xl space-y-5 border-b-4 border-sky-100">
      <div className="flex flex-col gap-1">
        <Label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1">What to build?</Label>
        <Input
          ref={inputRef}
          onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleAdd()}
          placeholder="資材名..."
          className="bg-transparent text-lg font-bold focus:outline-none placeholder:text-sky-200 border-none outline-none p-0"
        />
      </div>

      <div className="flex items-center justify-between border-t border-sky-100 pt-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="bg-transparent text-xs font-bold focus:outline-none text-sky-600 border-none"
            >
              <CalendarIcon />
              {targetDate ? new Date(targetDate).toLocaleDateString() : "日付選択！"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              // 文字列 → Date (UI表示用)
              selected={targetDate ? new Date(targetDate + 'T00:00:00') : undefined}
              onSelect={(date) => {
                // Date → 文字列 (State保存用)
                if (date) setTargetDate(format(date, 'yyyy-MM-dd'))
              }}
            />
          </PopoverContent>
        </Popover>

        {/* 色選択 */}
        <div className="flex gap-1.5">
          {(Object.keys(BLOCK_COLORS) as ColorName[]).map((name) => (
            <Button
              size="xs"
              key={name}
              onClick={() => setSelectedColor(name)}
              className={`h-5 w-5 rounded-full border-2 ${BLOCK_COLORS[name].bg} ${selectedColor === name ? 'scale-125' : 'border-white'} transition-transform`}
            />
          ))}
        </div>
      </div>
      <Button onClick={handleAdd} className="w-full bg-sky-500 text-white py-3 rounded-2xl text-xs font-black hover:bg-sky-600 transition-all shadow-[0_4px_0_0_rgba(14,165,233,0.3)] active:translate-y-1 active:shadow-none">
        ストックする
      </Button>
    </div>
  )
}