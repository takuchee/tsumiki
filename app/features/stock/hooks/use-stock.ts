import { useMemo } from "react";
import { toast } from "sonner";
import { taskLogRepository } from "../repository/stock-repository";
import { useStockContext } from "../contexts/stock-context";
import {
  createStockTask,
  updateStockTaskStatus,
  deleteStockTask,
} from "../usecases/stock-usecase";
import type { StockTask } from "../types";

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
      const newTask = await createStockTask({
        content,
        date: targetDate,
        colorName: selectedColor,
        status: "pending",
      });
      setAllTasks((prev) => [newTask, ...prev]);
      toast.success("資材をストック！🧱");
    } catch (error) {
      toast.error("ストックに失敗しました");
      return;
    }
  };

  const updateStatus = async (id: string, newStatus: StockTask["status"]) => {
    try {
      const updatedTask = await updateStockTaskStatus(id, newStatus);
      setAllTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task)),
      );
      const message =
        newStatus === "completed"
          ? "ストックを積み上げました！📦"
          : "資材に戻しました！⏪";
      toast.success(message);
    } catch (error) {
      toast.error("失敗");
      return;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStockTask(id);
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
    actions: { handleAdd, updateStatus, handleDelete },
  };
}
