/**
 * @fileoverview タスクログ関連のAPI呼び出しをまとめたファイル
 */
import { getSupabaseServer } from "~/lib/supabase";
import type {
  TaskLog,
  CreateTaskInput,
  UpdateTaskInput,
} from "../types/task-log";

const supabase = getSupabaseServer();

export const taskLogRepository = {
  /** 全てのタスクを取得する */
  async findAll(): Promise<TaskLog[]> {
    const { data, error } = await supabase
      .from("task_logs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return data as TaskLog[];
  },
  /** 新しいタスクを作成する */
  async create(task: CreateTaskInput): Promise<TaskLog> {
    const { data, error } = await supabase
      .from("task_logs")
      .insert(task)
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data as TaskLog;
  },
  /** タスクを更新する */
  async update(id: string, updates: UpdateTaskInput): Promise<TaskLog> {
    const { data, error } = await supabase
      .from("task_logs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data as TaskLog;
  },
  /** タスクを削除する */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("task_logs").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
  },
};
