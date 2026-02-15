import { useState, useMemo } from 'react'
import { useLoaderData, type LoaderFunctionArgs } from 'react-router'
import { Toaster, toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase, getSupabaseServer } from '~/lib/supabase'
import { StockSidebar, StockDrawer } from '~/features/stock'
import { StackView } from '~/features/viewer/components/stack-view'

// ※ BLOCK_COLORS は後ほどリファクタリング予定のため、一旦ここに配置
const BLOCK_COLORS = [
  { id: 0, bg: 'bg-emerald-400', shadow: 'bg-emerald-600', border: 'border-emerald-700', text: 'text-emerald-900', name: 'Green' },
  { id: 1, bg: 'bg-amber-400', shadow: 'bg-amber-600', border: 'border-amber-700', text: 'text-amber-900', name: 'Yellow' },
  { id: 2, bg: 'bg-sky-400', shadow: 'bg-sky-600', border: 'border-sky-700', text: 'text-sky-900', name: 'Blue' },
  { id: 3, bg: 'bg-rose-400', shadow: 'bg-rose-600', border: 'border-rose-700', text: 'text-rose-900', name: 'Red' },
  { id: 4, bg: 'bg-violet-400', shadow: 'bg-violet-600', border: 'border-violet-700', text: 'text-violet-900', name: 'Purple' },
]

export async function loader({ }: LoaderFunctionArgs) {
  // サーバーサイドでのデータ取得
  const client = getSupabaseServer();
  const { data } = await client
    .from('task_logs')
    .select('*')
    .order('created_at', { ascending: false });

  return { initialLogs: data ?? [] };
}

export default function IndexPage() {
  const { initialLogs } = useLoaderData<typeof loader>();

  // --- States ---
  const [allTasks, setAllTasks] = useState(() =>
    initialLogs.map((log: any) => ({
      id: log.id,
      content: log.task_name,
      date: log.task_date,
      colorIdx: BLOCK_COLORS.find(c => c.name === log.block_color)?.id || 0,
      status: log.status || 'pending',
    }))
  );
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Derived State (Memoized) ---
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

  // --- Handlers ---
  const handleAdd = async (content: string) => {
    const { data, error } = await supabase.from('task_logs').insert([{
      task_name: content,
      block_color: BLOCK_COLORS[selectedColorIdx].name,
      task_date: targetDate,
      status: 'pending'
    }]).select().single();

    if (error) return toast.error('ストックに失敗しました');

    setAllTasks([{
      id: data.id,
      content: data.task_name,
      date: data.task_date,
      colorIdx: selectedColorIdx,
      status: 'pending'
    }, ...allTasks]);
    toast.success('資材をストック！🧱');
  };

  const handleStack = async (id: string) => {
    const { error } = await supabase.from('task_logs').update({ status: 'completed' }).eq('id', id);
    if (error) return toast.error('積み上げに失敗しました');
    setAllTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    toast.success('ナイス積み上げ！🧱');
  };

  const handleUnstack = async (id: string) => {
    const { error } = await supabase.from('task_logs').update({ status: 'pending' }).eq('id', id);
    if (error) return toast.error('失敗しました');
    setAllTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'pending' } : t));
    toast.info('資材をパレットに戻しました ↩️');
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('task_logs').delete().eq('id', id);
    if (error) return toast.error('破棄に失敗しました');
    setAllTasks(prev => prev.filter(t => t.id !== id));
    toast.success('資材を破棄しました 🗑️');
  };

  // 共通の Props オブジェクト
  const commonProps = {
    materials,
    onAdd: handleAdd,
    onStack: handleStack,
    onDelete: handleDelete,
    targetDate,
    setTargetDate,
    selectedColorIdx,
    setSelectedColorIdx,
    BLOCK_COLORS
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#f0f9ff] overflow-hidden font-sans text-slate-900">
      <Toaster position="top-center" richColors />

      {/* 1. Desktop Side Navigation */}
      <StockSidebar {...commonProps} />

      {/* 2. Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <StockDrawer
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            {...commonProps}
          />
        )}
      </AnimatePresence>

      {/* 3. Main Viewing Area */}
      <main className="flex-1 relative bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 overflow-hidden flex flex-col">
        {/* Score Display */}
        <div className="absolute top-6 right-6 z-50">
          <motion.div
            key={totalPoints}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="bg-white/90 backdrop-blur border-4 border-sky-600 p-3 rounded-2xl shadow-xl flex flex-col items-center"
          >
            <span className="text-[10px] font-black text-sky-600 uppercase">Blocks</span>
            <span className="text-2xl md:text-3xl font-black text-sky-600 leading-none">{totalPoints}</span>
          </motion.div>
        </div>

        {/* Stack List */}
        <div className="flex-1 overflow-y-auto p-6 md:px-20 z-10 scrollbar-hide">
          <StackView
            groupedLogs={groupedLogs}
            onUnstack={handleUnstack}
            BLOCK_COLORS={BLOCK_COLORS}
          />
        </div>

        {/* Mobile Action Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden fixed bottom-8 right-8 w-16 h-16 bg-white text-sky-500 rounded-full shadow-2xl border-4 border-sky-400 flex items-center justify-center text-3xl font-black z-[60]"
        >
          ＋
        </motion.button>
      </main>
    </div>
  )
}