'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Field, Input, Label, Radio, RadioGroup } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { useLoaderData, type LoaderFunctionArgs } from 'react-router'
import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from "@supabase/ssr"
import '../app.css'

const BLOCK_COLORS = [
  { id: 0, bg: 'bg-emerald-400', shadow: 'bg-emerald-600', border: 'border-emerald-700', text: 'text-emerald-900', name: 'Green' },
  { id: 1, bg: 'bg-amber-400', shadow: 'bg-amber-600', border: 'border-amber-700', text: 'text-amber-900', name: 'Yellow' },
  { id: 2, bg: 'bg-sky-400', shadow: 'bg-sky-600', border: 'border-sky-700', text: 'text-sky-900', name: 'Blue' },
  { id: 3, bg: 'bg-rose-400', shadow: 'bg-rose-600', border: 'border-rose-700', text: 'text-rose-900', name: 'Red' },
  { id: 4, bg: 'bg-violet-400', shadow: 'bg-violet-600', border: 'border-violet-700', text: 'text-violet-900', name: 'Purple' },
]

export async function loader({ }: LoaderFunctionArgs) {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  const { data: initialData } = await supabase
    .from('task_logs')
    .select('*')
    .order('created_at', { ascending: false });

  return {
    initialLogs: initialData ?? [],
    env: { SUPABASE_URL: process.env.SUPABASE_URL!, SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY! },
  };
}

export default function App() {
  const { env, initialLogs } = useLoaderData<typeof loader>();
  const [supabase] = useState(() => createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY))

  const getTodayDate = () => new Date().toISOString().split('T')[0]

  // ステートではなくRefで管理（日本語入力を保護するため）
  const inputRef = useRef<HTMLInputElement>(null)
  const [targetDate, setTargetDate] = useState(getTodayDate())
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [allTasks, setAllTasks] = useState<any[]>(() =>
    initialLogs.map((log: any) => ({
      id: log.id,
      content: log.task_name,
      date: log.task_date,
      colorIdx: BLOCK_COLORS.find(c => c.name === log.block_color)?.id || 0,
      status: log.status || 'pending',
    }))
  );

  const materials = useMemo(() => allTasks.filter(t => t.status === 'pending'), [allTasks]);
  const totalPoints = useMemo(() => allTasks.filter(t => t.status === 'completed').length, [allTasks]);

  const groupedLogs = useMemo(() => {
    const completed = allTasks.filter(t => t.status === 'completed');
    const groups: { [key: string]: any[] } = {};
    completed.forEach(task => {
      if (!groups[task.date]) groups[task.date] = [];
      groups[task.date].push(task);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [allTasks]);

  const addMaterial = async () => {
    const val = inputRef.current?.value || ""
    if (!val.trim()) return

    const { data, error } = await supabase
      .from('task_logs')
      .insert([{
        task_name: val,
        block_color: BLOCK_COLORS[selectedColorIdx].name,
        task_date: targetDate,
        status: 'pending'
      }])
      .select().single();

    if (error) { toast.error('失敗しました'); return }
    setAllTasks([{ id: data.id, content: data.task_name, date: data.task_date, colorIdx: selectedColorIdx, status: 'pending' }, ...allTasks])

    // 入力欄をクリア
    if (inputRef.current) inputRef.current.value = ""
    setIsMobileMenuOpen(false)
    toast.success('資材をストック！🧱')
  }

  const stackMaterial = async (id: string) => {
    const { error } = await supabase.from('task_logs').update({ status: 'completed' }).eq('id', id);
    if (error) { toast.error('失敗しました'); return }
    setAllTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    toast.success('ナイス積み上げ！🧱');
  }

  const unstackMaterial = async (id: string) => {
    const { error } = await supabase.from('task_logs').update({ status: 'pending' }).eq('id', id);
    if (error) { toast.error('失敗しました'); return }
    setAllTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'pending' } : t));
    toast.info('資材をパレットに戻しました ↩️');
  }

  const deleteMaterial = async (id: string) => {
    const { error } = await supabase.from('task_logs').delete().eq('id', id);
    if (error) { toast.error('失敗しました'); return }
    setAllTasks(prev => prev.filter(t => t.id !== id));
    toast.success('資材を破棄しました 🗑️');
  }

  const SidebarContent = () => (
    <>
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-black tracking-tighter italic text-sky-600">TSUMIKI</h1>
        <p className="text-[10px] font-black text-sky-400 mt-2 tracking-[0.2em] uppercase">Material Stock</p>
      </header>

      <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <div className="bg-sky-50/50 p-5 rounded-3xl space-y-5 border-b-4 border-sky-100">
          <Field className="flex flex-col gap-1">
            <Label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1">What to build?</Label>
            <input
              ref={inputRef}
              onKeyDown={(e) => {
                // IME確定のEnterと送信のEnterを区別するためのチェック
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                  addMaterial()
                }
              }}
              placeholder="資材名..."
              className="w-full bg-transparent text-lg font-bold focus:outline-none placeholder:text-sky-200 border-none outline-none p-0"
            />
          </Field>
          <div className="flex items-center justify-between border-t border-sky-100 pt-4">
            <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="bg-transparent text-xs font-bold focus:outline-none text-sky-600" />
            <RadioGroup value={selectedColorIdx} onChange={setSelectedColorIdx} className="flex gap-1.5">
              {BLOCK_COLORS.map((c) => (
                <Radio key={c.id} value={c.id} className={({ checked }) => `w-5 h-5 rounded-full cursor-pointer border-2 ${c.bg} ${checked ? 'border-sky-600 scale-125' : 'border-white'} transition-transform`} />
              ))}
            </RadioGroup>
          </div>
          <button onClick={addMaterial} className="w-full bg-sky-500 text-white py-3 rounded-2xl text-xs font-black hover:bg-sky-600 transition-all shadow-[0_4px_0_0_rgba(14,165,233,0.3)] active:translate-y-1 active:shadow-none">ストックする</button>
        </div>

        <section>
          <h2 className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mb-4">Stock Palette</h2>
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {materials.map((m) => {
                const color = BLOCK_COLORS[m.colorIdx]
                return (
                  <motion.div key={m.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className="group relative">
                    <button onClick={() => deleteMaterial(m.id)} className="absolute -top-2 -left-2 w-6 h-6 bg-white border-2 border-sky-100 rounded-full flex items-center justify-center text-sky-300 opacity-0 group-hover:opacity-100 hover:text-rose-500 z-30 transition-all shadow-sm">×</button>
                    <button onClick={() => stackMaterial(m.id)} className={`w-full p-3 rounded-xl border-2 ${color.border} ${color.bg} shadow-[0_4px_0_0_rgba(0,0,0,0.05)] text-left overflow-hidden`}>
                      <span className="text-[8px] font-black opacity-50 block mb-1 text-sky-900">{m.date.replace(/-/g, '.')}</span>
                      <span className={`block truncate text-[11px] font-black ${color.text}`}>{m.content}</span>
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </>
  )

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#f0f9ff] overflow-hidden font-sans text-slate-900">
      <Toaster position="top-center" richColors />

      <aside className="hidden md:flex w-[400px] p-10 bg-white/80 backdrop-blur-xl border-r border-sky-100 flex-col z-20 shadow-2xl">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-sky-900/40 backdrop-blur-sm z-40 md:hidden" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 inset-x-0 h-[80vh] bg-white rounded-t-[3rem] p-8 z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] md:hidden flex flex-col">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)} />
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 relative bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 overflow-hidden flex flex-col">
        <div className="md:hidden absolute top-6 left-6 z-30">
          <h1 className="text-2xl font-black tracking-tighter italic text-white drop-shadow-md">TSUMIKI</h1>
        </div>

        <div className="absolute top-6 right-6 z-50">
          <motion.div key={totalPoints} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="bg-white/90 backdrop-blur border-4 border-sky-600 p-3 rounded-2xl shadow-[8px_8px_0_0_rgba(2,132,199,0.3)] flex flex-col items-center">
            <span className="text-[10px] font-black text-sky-600 uppercase">Blocks</span>
            <span className="text-2xl md:text-3xl font-black text-sky-600 leading-none">{totalPoints}</span>
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:px-20 md:pb-32 z-10 scrollbar-hide">
          <div className="max-w-md mx-auto py-20 flex flex-col">
            {groupedLogs.map(([date, tasks]) => (
              <div key={date} className="flex flex-col mb-16 relative">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="h-0.5 w-8 bg-white/30 rounded-full" />
                  <span className="text-[12px] font-black text-white drop-shadow-sm uppercase tracking-[0.2em]">{date.replace(/-/g, ' . ')}</span>
                  <div className="h-0.5 w-8 bg-white/30 rounded-full" />
                </div>
                <div className="flex flex-col -space-y-[1.5rem]">
                  <AnimatePresence initial={false}>
                    {tasks.map((log) => {
                      const color = BLOCK_COLORS[log.colorIdx]
                      return (
                        <motion.button key={log.id} layout initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 200 }} onClick={() => unstackMaterial(log.id)} className="relative group cursor-pointer w-full">
                          <div className={`relative ${color.bg} border-x-2 ${color.border} px-6 py-6 min-h-[90px] rounded-t-[2.5rem] rounded-b-[1.2rem] shadow-[inset_0_4px_0_rgba(255,255,255,0.4),0_20px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-center items-center text-center transition-all`}>
                            <div className={`absolute bottom-0 left-0 w-full h-4 ${color.shadow} rounded-b-[1.2rem] border-t border-black/10`} />
                            <p className={`font-black text-xl leading-tight drop-shadow-sm ${color.text} relative z-10 uppercase tracking-tight`}>{log.content}</p>
                          </div>
                        </motion.button>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsMobileMenuOpen(true)} className="md:hidden fixed bottom-8 right-8 w-16 h-16 bg-white text-sky-500 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.2)] border-4 border-sky-400 flex items-center justify-center text-3xl font-black z-[60]">＋</motion.button>
      </main>
    </div>
  )
}