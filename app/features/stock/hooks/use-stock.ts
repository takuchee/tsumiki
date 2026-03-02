import { useState, useMemo } from "react";
import { supabase } from "~/lib/supabase";
import { toast } from "sonner";

export function useStock(initialLogs: any[] = [], BLOCK_COLORS: any[] = []) {
  // guard against undefined or non-array values coming from props/loader
  const safeLogs = Array.isArray(initialLogs) ? initialLogs : [];
  if (!Array.isArray(initialLogs)) {
    console.warn(
      "useStock received invalid initialLogs, falling back to empty array",
      initialLogs,
    );
  }

  const [allTasks, setAllTasks] = useState(() =>
    safeLogs.map((log: any) => ({
      id: log.id,
      content: log.task_name,
      date: log.task_date,
      colorIdx: BLOCK_COLORS.find((c) => c.name === log.block_color)?.id || 0,
      status: log.status || "pending",
    })),
  );

  const [targetDate, setTargetDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  // 派生データ
  const materials = useMemo(
    () => allTasks.filter((t) => t.status === "pending"),
    [allTasks],
  );
  const completedTasks = useMemo(
    () => allTasks.filter((t) => t.status === "completed"),
    [allTasks],
  );
  const totalPoints = completedTasks.length;

  const handleAdd = async (content: string) => {
    const { data, error } = await supabase
      .from("task_logs")
      .insert([
        {
          task_name: content,
          block_color: BLOCK_COLORS[selectedColorIdx].name,
          task_date: targetDate,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) return toast.error("ストックに失敗しました");
    setAllTasks([
      {
        id: data.id,
        content: data.task_name,
        date: data.task_date,
        colorIdx: selectedColorIdx,
        status: "pending",
      },
      ...allTasks,
    ]);
    toast.success("資材をストック！🧱");
  };

  const handleStack = async (id: string) => {
    const { error } = await supabase
      .from("task_logs")
      .update({ status: "completed" })
      .eq("id", id);
    if (error) return toast.error("失敗");
    setAllTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t)),
    );
  };

  const handleUnstack = async (id: string) => {
    const { error } = await supabase
      .from("task_logs")
      .update({ status: "pending" })
      .eq("id", id);
    if (error) return toast.error("失敗");
    setAllTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "pending" } : t)),
    );
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("task_logs").delete().eq("id", id);
    if (error) return toast.error("失敗");
    setAllTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    materials,
    completedTasks,
    totalPoints,
    state: { targetDate, setTargetDate, selectedColorIdx, setSelectedColorIdx },
    actions: { handleAdd, handleStack, handleUnstack, handleDelete },
  };
}
