'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Field, Input, Label, Radio, RadioGroup } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import '../app.css'

const BLOCK_COLORS = [
  { id: 0, bg: 'bg-emerald-400', border: 'border-emerald-600', text: 'text-white', name: 'Green' },
  { id: 1, bg: 'bg-amber-400', border: 'border-amber-600', text: 'text-white', name: 'Yellow' },
  { id: 2, bg: 'bg-sky-400', border: 'border-sky-600', text: 'text-white', name: 'Blue' },
  { id: 3, bg: 'bg-rose-400', border: 'border-rose-600', text: 'text-white', name: 'Red' },
  { id: 4, bg: 'bg-violet-400', border: 'border-violet-600', text: 'text-white', name: 'Purple' },
]

export default function App() {
  const getCurrentDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }

  const [text, setText] = useState('')
  const [datetime, setDatetime] = useState(getCurrentDateTime())
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [logs, setLogs] = useState<{ id: number; content: string; date: string; colorIdx: number }[]>([])

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [logs])

  const addLog = () => {
    if (!text.trim()) return
    const newLog = {
      id: Date.now(),
      content: text,
      date: datetime.replace('T', ' '),
      colorIdx: selectedColorIdx
    }
    setLogs([newLog, ...logs])
    setText('')
    setDatetime(getCurrentDateTime())
    toast.success('ナイス積み上げ！🧱')
  }

  const rank = useMemo(() => {
    const count = logs.length
    if (count >= 20) return "Space 🚀"
    if (count >= 10) return "Cloud ☁️"
    if (count >= 5) return "Roof 🏠"
    return "Ground 🌱"
  }, [logs.length])

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#F8FAFC] overflow-hidden">
      <Toaster position="top-center" richColors />

      {/* モバイルヘッダー */}
      <header className="md:hidden p-4 bg-white/80 backdrop-blur-md border-b flex justify-between items-center z-30">
        <h1 className="font-black text-xl tracking-tighter italic text-blue-600">TSUMIKI</h1>
        <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black">{rank}</div>
      </header>

      {/* 左側：入力エリア */}
      <aside className="w-full md:w-[400px] p-6 md:p-12 bg-white border-t md:border-t-0 md:border-r border-slate-200 order-2 md:order-1 shadow-2xl z-20 overflow-y-auto max-h-[50vh] md:max-h-full">
        <header className="hidden md:block mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">
            積み記<br /><span className="text-blue-600 italic text-2xl">TSUMIKI</span>
          </h1>
          <p className="mt-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Rank: {rank}</p>
        </header>

        <div className="grid grid-cols-1 gap-5 md:gap-7">
          <Field className="flex flex-col gap-2">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Achievement</Label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLog()}
              placeholder="何をした？"
              className="w-full block rounded-xl bg-slate-50 py-3.5 px-5 text-base md:text-lg border-2 border-transparent focus:border-blue-400 focus:bg-white focus:outline-none transition-all shadow-inner"
            />
          </Field>

          <Field className="flex flex-col gap-2">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Color</Label>
            <RadioGroup value={selectedColorIdx} onChange={setSelectedColorIdx} className="flex gap-2.5">
              {BLOCK_COLORS.map((color) => (
                <Radio
                  key={color.id}
                  value={color.id}
                  className={({ checked }) =>
                    `group relative flex h-9 w-9 md:h-10 md:w-10 cursor-pointer rounded-full border-4 transition-all focus:outline-none ${color.bg} ${checked ? 'border-slate-900 scale-110 shadow-lg' : 'border-white'
                    }`
                  }
                >
                  <span className="sr-only">{color.name}</span>
                </Radio>
              ))}
            </RadioGroup>
          </Field>

          <Field className="flex flex-col gap-2">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Timestamp</Label>
            <Input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full block rounded-xl bg-slate-50 py-3 px-4 text-xs md:text-sm border-2 border-transparent focus:border-blue-400 focus:outline-none transition-all"
            />
          </Field>

          <button
            onClick={addLog}
            className={`w-full py-4 text-white font-black text-lg md:text-xl rounded-xl active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 ${BLOCK_COLORS[selectedColorIdx].bg} ${BLOCK_COLORS[selectedColorIdx].border} border-b-4`}
          >
            積み上げる 🧱
          </button>
        </div>
      </aside>

      {/* 右側：表示エリア */}
      <main className="flex-1 relative bg-gradient-to-b from-blue-50 to-white flex overflow-hidden order-1 md:order-2">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="text-[10rem] md:text-[25rem] font-black text-slate-200/30 select-none">{logs.length}</span>
        </div>

        {/* ポイント雲 */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-6 right-6 md:top-10 md:right-10 z-30 bg-white/90 backdrop-blur px-5 py-3 rounded-2xl shadow-xl border border-white flex items-center gap-4"
        >
          <div className="text-blue-400 scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.038,0.001-0.076,0.003-0.114C11.666,13.315,11.338,13.3,11,13.3 c-2.209,0-4,1.791-4,4c0,2.209,1.791,4,4,4h6.5c1.933,0,3.5-1.567,3.5-3.5S19.433,14.3,17.5,14.3c-0.114,0-0.226,0.008-0.337,0.02 C17.118,14.12,17.1,13.911,17.1,13.7c0-1.878,1.522-3.4,3.4-3.4c1.878,0,3.4,1.522,3.4,3.4S22.378,17.1,20.5,17.1 c-0.115,0-0.227-0.009-0.337-0.021C20.117,17.103,20.06,17.1,20,17.1c-0.276,0-0.5,0.224-0.5,0.5v0.5 C19.5,18.657,18.604,19,17.5,19z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Score</p>
            <p className="text-xl md:text-2xl font-black text-slate-800 leading-none mt-1">{logs.length}pt</p>
          </div>
        </motion.div>

        {/* スクロールエリア */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-6 md:px-20 md:pb-24 z-10 scrollbar-hide"
        >
          <div className="min-h-full flex flex-col justify-end">
            <div className="flex flex-col gap-3 md:gap-4 w-full max-w-sm md:max-w-xl mx-auto py-8">
              <AnimatePresence initial={false}>
                {logs.map((log) => {
                  const color = BLOCK_COLORS[log.colorIdx]
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      className={`${color.bg} ${color.text} ${color.border} p-4 md:p-6 rounded-xl md:rounded-2xl border-b-[4px] md:border-b-[6px] border-r-[2px] md:border-r-[4px] shadow-lg relative overflow-hidden`}
                    >
                      <span className="text-[8px] md:text-[10px] font-bold opacity-75 block mb-1">{log.date}</span>
                      <p className="font-extrabold text-base md:text-xl leading-snug tracking-tight break-all">{log.content}</p>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {logs.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-300 font-bold">実績を積み上げましょう 🧱</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}