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
  { id: 0, bg: 'bg-emerald-400', border: 'border-emerald-600', text: 'text-emerald-700', name: 'Green' },
  { id: 1, bg: 'bg-amber-400', border: 'border-amber-600', text: 'text-amber-700', name: 'Yellow' },
  { id: 2, bg: 'bg-sky-400', border: 'border-sky-600', text: 'text-sky-700', name: 'Blue' },
  { id: 3, bg: 'bg-rose-400', border: 'border-rose-600', text: 'text-rose-700', name: 'Red' },
  { id: 4, bg: 'bg-violet-400', border: 'border-violet-600', text: 'text-violet-700', name: 'Purple' },
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

  const [text, setText] = useState('')
  const [targetDate, setTargetDate] = useState(getTodayDate())
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)

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

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const addMaterial = async () => {
    if (!text.trim()) return
    const { data, error } = await supabase
      .from('task_logs')
      .insert([{
        task_name: text,
        block_color: BLOCK_COLORS[selectedColorIdx].name,
        task_date: targetDate,
        status: 'pending'
      }])
      .select().single();

    if (error) { toast.error('失敗しました'); return }
    setAllTasks([{ id: data.id, content: data.task_name, date: data.task_date, colorIdx: selectedColorIdx, status: 'pending' }, ...allTasks])
    setText('')
    toast.success('資材をストック！🧱')
  }

  // 【重要修正】DBを更新し、成功したらStateを確実に上書きする
  const stackMaterial = async (id: string) => {
    // 1. まずDBをアップデートする（戻り値を期待しない設定）
    const { error } = await supabase
      .from('task_logs')
      .update({ status: 'completed' })
      .eq('id', id);

    if (error) {
      console.error('Database update error:', error);
      toast.error('積み上げに失敗しました');
      return;
    }

    // 2. DB更新が成功した「前提」でフロントのStateを更新する
    // これにより、406エラーで止まるのを防ぎつつ、画面を即座に更新します
    setAllTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: 'completed' } : t
    ));

    toast.success('ナイス積み上げ！🧱');
  }

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      <Toaster position="top-center" richColors />

      {/* 左側：建築資材エリア */}
      <aside className="w-full md:w-[400px] p-6 md:p-10 bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl overflow-hidden">
        <header className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter italic">TSUMIKI</h1>
          <p className="text-[10px] font-black text-slate-400 mt-2 tracking-[0.2em] uppercase">Material Stock</p>
        </header>

        <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
          <div className="bg-slate-50 p-5 rounded-3xl space-y-5 border border-slate-100 shadow-inner">
            <Field className="flex flex-col gap-1">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">What to build?</Label>
              <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addMaterial()} placeholder="資材名..." className="w-full bg-transparent text-lg font-bold focus:outline-none placeholder:text-slate-300" />
            </Field>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <Field className="flex flex-col gap-1">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</Label>
                <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="bg-transparent text-xs font-bold focus:outline-none text-slate-500" />
              </Field>
              <RadioGroup value={selectedColorIdx} onChange={setSelectedColorIdx} className="flex gap-1.5">
                {BLOCK_COLORS.map((c) => (
                  <Radio key={c.id} value={c.id} className={({ checked }) => `w-5 h-5 rounded-full cursor-pointer border-2 ${c.bg} ${checked ? 'border-slate-900 scale-110' : 'border-white shadow-sm'}`} />
                ))}
              </RadioGroup>
            </div>
            <button onClick={addMaterial} className="w-full bg-slate-900 text-white py-3 rounded-2xl text-xs font-black hover:bg-blue-600 transition-all shadow-lg">ストックする</button>
          </div>

          <section>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Stock Palette</h2>
            <div className="grid grid-cols-2 gap-2">
              <AnimatePresence>
                {materials.map((m) => {
                  const color = BLOCK_COLORS[m.colorIdx]
                  return (
                    <motion.button key={m.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 100 }} onClick={() => stackMaterial(m.id)} className={`group relative flex flex-col p-3 rounded-2xl border-2 ${color.bg} bg-opacity-10 ${color.border} ${color.text} text-[11px] font-black text-left hover:bg-opacity-20 active:scale-95`}>
                      <span className="opacity-60 text-[9px] mb-1">{m.date.replace(/-/g, '.')}</span>
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate">{m.content}</span>
                        <span className="w-4 h-4 flex items-center justify-center bg-white rounded shadow-sm text-[10px]">＋</span>
                      </div>
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </aside>

      {/* 右側：地層エリア */}
      <main className="flex-1 relative bg-slate-100 overflow-hidden flex flex-col">

        {/* 【修正】右上のポイント表示バッジ */}
        <div className="absolute top-6 right-6 z-50">
          <motion.div
            key={totalPoints}
            initial={{ scale: 1.2, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white border-2 border-slate-900 px-4 py-2 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center min-w-[80px]"
          >
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Blocks</span>
            <span className="text-2xl font-black text-slate-900 leading-none">{totalPoints}</span>
          </motion.div>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 md:px-20 md:pb-24 z-10 scrollbar-hide">
          <div className="max-w-md mx-auto py-10 relative">
            {groupedLogs.map(([date, tasks]) => (
              <div key={date} className="mb-12">
                <div className="sticky top-0 z-20 py-3 bg-slate-100/90 backdrop-blur-md mb-6 flex items-center gap-3">
                  <div className="h-[1px] flex-1 bg-slate-200" />
                  <span className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black text-slate-500 shadow-sm uppercase">{date.replace(/-/g, ' / ')}</span>
                  <div className="h-[1px] flex-1 bg-slate-200" />
                </div>
                <div className="flex flex-col space-y-4">
                  <AnimatePresence initial={false}>
                    {tasks.map((log) => {
                      const color = BLOCK_COLORS[log.colorIdx]
                      return (
                        <motion.div key={log.id} layout initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className={`${color.bg} ${color.border} p-6 rounded-[2rem] border-b-[8px] border-r-[4px] shadow-2xl text-white`}>
                          <p className="font-black text-xl leading-snug break-all">{log.content}</p>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}