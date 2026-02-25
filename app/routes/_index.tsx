import { useLoaderData } from 'react-router';
import { Toaster } from 'sonner';
import { getSupabaseServer } from '~/lib/supabase';
import { StockAddSection } from '~/features/stock/components/stock-add-section';
import { ViewerSection } from '~/features/viewer/components/viewer-section'; // 同様に作成
import { BLOCK_COLORS } from '~/features/stock/constants';

export async function loader() {
  const { data } = await getSupabaseServer().from('task_logs').select('*').order('created_at', { ascending: false });
  return { initialLogs: data ?? [] };
}

export default function IndexPage() {
  const { initialLogs } = useLoaderData<typeof loader>();

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#f0f9ff] overflow-hidden">
      <Toaster position="top-center" richColors />

      {/* ストック追加画面 */}
      <StockAddSection initialLogs={initialLogs} BLOCK_COLORS={BLOCK_COLORS} />

      {/* ストック積み上げ画面 */}
      <main className="flex-1 relative bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 overflow-hidden flex flex-col">
        <ViewerSection initialLogs={initialLogs} BLOCK_COLORS={BLOCK_COLORS} />
      </main>
    </div>
  );
}