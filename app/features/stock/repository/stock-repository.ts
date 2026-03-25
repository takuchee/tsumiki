/**
 * @fileoverview タスクログ関連のAPI呼び出しをまとめたファイル
 */
import { getSupabaseServer } from "~/lib/supabase";
import type {
  TaskLogEntity,
  CreateTaskLog,
  UpdateTaskLog,
} from "../types/entity";

const supabase = getSupabaseServer();

export const taskLogRepository = {
  /** 全てのタスクを取得する */
  async findAll(): Promise<TaskLogEntity[]> {
    const { data, error } = await supabase
      .from("task_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data as TaskLogEntity[]) ?? [];
  },
  /** 新しいタスクを作成する */
  async create(task: CreateTaskLog): Promise<TaskLogEntity> {
    const { data, error } = await supabase
      .from("task_logs")
      .insert(task)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },
  /** タスクを更新する */
  async update(id: string, updates: UpdateTaskLog): Promise<TaskLogEntity> {
    const { data, error } = await supabase
      .from("task_logs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
  /** タスクを削除する */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("task_logs").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
  },
};
