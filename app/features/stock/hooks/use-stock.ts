import { useMemo } from "react";
import { toast } from "sonner";
import { taskLogRepository } from "../api/task-logs";
import { useStockContext } from "../stores/stock-store";
import type { TaskLog } from "../types";

export function useStock() {
  const {
    allTasks,
    setAllTasks,
    targetDate,
    setTargetDate,
    selectedColor,
    setSelectedColor,
  } = useStockContext();

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
        block_color: selectedColor,
        status: "pending",
      });
      setAllTasks((prev) => [newTask, ...prev]);
      toast.success("資材をストック！🧱");
    } catch (error) {
      toast.error("ストックに失敗しました");
      return;
    }
  };

  const updateStatus = async (id: string, newStatus: TaskLog["status"]) => {
    try {
      const updatedTask = await taskLogRepository.update(id, {
        status: newStatus,
      });
      setAllTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task)),
      );
      toast.success("ストックを積み上げました！📦");
    } catch (error) {
      toast.error("失敗");
      return;
    }
  };
  const handleStack = (id: string) => updateStatus(id, "completed");
  const handleUnstack = (id: string) => updateStatus(id, "pending");

  const handleDelete = async (id: string) => {
    try {
      await taskLogRepository.delete(id);
      setAllTasks((prev) => prev.filter((task) => task.id !== id));
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
    state: { targetDate, setTargetDate, selectedColor, setSelectedColor },
    actions: { handleAdd, handleStack, handleUnstack, handleDelete },
  };
}
