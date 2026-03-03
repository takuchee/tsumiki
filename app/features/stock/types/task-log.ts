/**
 * Supabaseの 'task_logs' テーブルのデータ構造
 */
export interface TaskLog {
  id: string;
  task_name: string;
  task_date: string;
  block_color: string;
  status: "pending" | "completed";
  created_at: string;
}

export type CreateTaskInput = Omit<TaskLog, "id" | "created_at">;
export type UpdateTaskInput = Partial<Omit<TaskLog, "id" | "created_at">>;

/**
 * アプリケーション内部で扱うタスク型
 */
export interface StockTask {
  id: string;
  content: string;
  date: string;
  colorIdx: number;
  status: "pending" | "completed";
}
