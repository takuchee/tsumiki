import { useState, useMemo } from "react";
import { toast } from "sonner";
import { BLOCK_COLORS } from "~/features/config/block-colors";
import { taskLogRepository } from "../api/task-logs";
import type { TaskLog } from "../types/task-log";

export function useStock(initialLogs: TaskLog[]) {
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
    try {
      const newTask = await taskLogRepository.create({
        task_name: content,
        task_date: targetDate,
        block_color: BLOCK_COLORS[selectedColorIdx].name,
        status: "pending",
      });
      setAllTasks([
        {
          id: newTask.id,
          content: newTask.task_name,
          date: newTask.task_date,
          colorIdx: selectedColorIdx,
          status: "pending",
        },
        ...allTasks,
      ]);
      toast.success("資材をストック！🧱");
    } catch (error) {
      toast.error("ストックに失敗しました");
      return;
    }
  };

  const handleStack = async (id: string) => {
    try {
      await taskLogRepository.update(id, { status: "completed" });
      setAllTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t)),
      );
      toast.success("ストックを積み上げました！📦");
    } catch (error) {
      toast.error("失敗");
      return;
    }
  };

  const handleUnstack = async (id: string) => {
    try {
      await taskLogRepository.update(id, { status: "pending" });
      setAllTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "pending" } : t)),
      );
      toast.success("ストックに戻しました！🔄");
    } catch (error) {
      toast.error("失敗");
      return;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await taskLogRepository.delete(id);
      setAllTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("ストックを削除しました！🗑️");
    } catch (error) {
      toast.error("削除に失敗しました");
      return;
    }
  };

  return {
    materials,
    completedTasks,
    totalPoints,
    state: { targetDate, setTargetDate, selectedColorIdx, setSelectedColorIdx },
    actions: { handleAdd, handleStack, handleUnstack, handleDelete },
  };
}
