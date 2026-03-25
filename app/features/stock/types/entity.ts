/**
 * DBのテーブル構造を表す型定義
 */

/**
 * Supabaseの 'task_logs' テーブルのデータ構造
 */
export interface TaskLogEntity {
  id: string;
  task_name: string;
  task_date: string;
  block_color: string;
  status: "pending" | "completed";
  created_at: string;
}

export type CreateTaskLog = Omit<TaskLogEntity, "id" | "created_at">;
export type UpdateTaskLog = Partial<CreateTaskLog>;
