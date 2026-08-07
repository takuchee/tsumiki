import type { SupabaseClient } from "@supabase/supabase-js";
import { createTaskLogRepository } from "../repository/stock-repository";
import type {
	ColorName,
	CreateTaskLog,
	StockTask,
	TaskLogEntity,
} from "../types";

/**
 * ストック一覧を取得
 */
export const getStockTasks = async (
	supabase: SupabaseClient,
	userId: string,
): Promise<StockTask[]> => {
	const taskLogRepository = createTaskLogRepository(supabase);
	try {
		const taskLogsEntity: TaskLogEntity[] =
			await taskLogRepository.findAll(userId);
		return taskLogsEntity.map(toStockTask);
	} catch (error) {
		console.error("タスクの取得に失敗:", error);
		throw error;
	}
};
const toStockTask = (entity: TaskLogEntity): StockTask => {
	const colorName = (entity.block_color as ColorName) || "Green";
	return {
		id: entity.id,
		content: entity.task_name,
		date: entity.task_date,
		colorName: colorName,
		status: entity.status,
	};
};

/**
 * ストック新規作成
 */
export const createStockTask = async (
	supabase: SupabaseClient,
	task: Omit<StockTask, "id">,
): Promise<StockTask> => {
	const taskLogRepository = createTaskLogRepository(supabase);
	try {
		const toTaskLogEntity: CreateTaskLog = {
			task_name: task.content,
			task_date: task.date,
			block_color: task.colorName,
			status: task.status,
		};
		const newTask = await taskLogRepository.create(toTaskLogEntity);
		return toStockTask(newTask);
	} catch (error) {
		console.error("タスクの作成に失敗:", error);
		throw error;
	}
};

/**
 *ストック削除
 */
export const deleteStockTask = async (
	supabase: SupabaseClient,
	id: string,
): Promise<void> => {
	const taskLogRepository = createTaskLogRepository(supabase);
	try {
		await taskLogRepository.delete(id);
	} catch (error) {
		console.error("タスクの削除に失敗:", error);
		throw error;
	}
};

/**
 * ストックのステータス更新
 */
export const updateStockTaskStatus = async (
	supabase: SupabaseClient,
	id: string,
	newStatus: StockTask["status"],
) => {
	const taskLogRepository = createTaskLogRepository(supabase);
	try {
		const updatedTask = await taskLogRepository.update(id, {
			status: newStatus,
		});
		return toStockTask(updatedTask);
	} catch (error) {
		console.error("タスクのステータス更新に失敗:", error);
		throw error;
	}
};
