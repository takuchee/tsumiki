import type { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ColorName, StockTask, TaskLogEntity } from "../types";
import {
	createStockTask,
	deleteStockTask,
	getStockTasks,
	updateStockTaskStatus,
} from "../usecases";

const mockRepositoryMethods = {
	create: vi.fn(),
	update: vi.fn(),
	findAll: vi.fn(),
	delete: vi.fn(),
};

vi.mock("../repository/stock-repository", () => ({
	createTaskLogRepository: () => mockRepositoryMethods,
}));

describe("Stock Usecases Test", () => {
	const fakeSupabase = {} as unknown as SupabaseClient;
	const dummyUserId = "user-123";

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("createStockTask", () => {
		it("タスクの作成に成功し、EntityからStockTaskへの変換が正しく行われること", async () => {
			const mockInput: Omit<StockTask, "id"> = {
				content: "New Task",
				date: "2024-01-01",
				colorName: "green" as ColorName,
				status: "pending",
			};
			const mockRepoResponse: TaskLogEntity = {
				id: "1",
				task_name: mockInput.content,
				task_date: mockInput.date,
				block_color: mockInput.colorName.toString(),
				status: mockInput.status,
				created_at: Date.now().toString(),
			};

			mockRepositoryMethods.create.mockResolvedValue(mockRepoResponse);

			const result = await createStockTask(fakeSupabase, mockInput);

			expect(mockRepositoryMethods.create).toHaveBeenCalledWith({
				task_name: mockInput.content,
				task_date: mockInput.date,
				block_color: mockInput.colorName.toString(),
				status: mockInput.status,
			});
			expect(result).toEqual({
				id: "1",
				content: "New Task",
				date: "2024-01-01",
				colorName: "green",
				status: "pending",
			});
		});

		it("block_colorが空文字の場合、colorNameがデフォルトのGreenになること", async () => {
			const mockInput: Omit<StockTask, "id"> = {
				content: "New Task",
				date: "2024-01-01",
				colorName: "green" as ColorName,
				status: "pending",
			};
			const mockRepoResponse: TaskLogEntity = {
				id: "1",
				task_name: mockInput.content,
				task_date: mockInput.date,
				block_color: "",
				status: mockInput.status,
				created_at: Date.now().toString(),
			};

			mockRepositoryMethods.create.mockResolvedValue(mockRepoResponse);

			const result = await createStockTask(fakeSupabase, mockInput);

			expect(result.colorName).toBe("Green");
		});

		it("エラー発生時、例外をスローすること", async () => {
			const mockInput: Omit<StockTask, "id"> = {
				content: "New Task",
				date: "2024-01-01",
				colorName: "green" as ColorName,
				status: "pending",
			};
			const mockError = new Error("Database error");
			mockRepositoryMethods.create.mockRejectedValue(mockError);

			await expect(createStockTask(fakeSupabase, mockInput)).rejects.toThrow(
				"Database error",
			);
		});
	});

	describe("updateStockTaskStatus", () => {
		it("ステータスの更新に成功し、変換されたタスクを返すこと", async () => {
			const mockId = "1";
			const mockNewStatus = "completed";
			const mockRepoResponse: TaskLogEntity = {
				id: mockId,
				task_date: "2024-01-01",
				block_color: "red",
				created_at: Date.now().toString(),
				task_name: "Test Task",
				status: mockNewStatus,
			};

			mockRepositoryMethods.update.mockResolvedValue(mockRepoResponse);

			const result = await updateStockTaskStatus(
				fakeSupabase,
				mockId,
				mockNewStatus,
			);

			expect(mockRepositoryMethods.update).toHaveBeenCalledWith(mockId, {
				status: mockNewStatus,
			});
			expect(result.id).toBe(mockId);
			expect(result.status).toBe("completed");
		});

		it("エラー発生時、例外をスローすること", async () => {
			const mockError = new Error("Database error");
			mockRepositoryMethods.update.mockRejectedValue(mockError);

			await expect(
				updateStockTaskStatus(fakeSupabase, "1", "completed"),
			).rejects.toThrow("Database error");
		});
	});

	describe("getStockTasks", () => {
		it("タスクの取得に成功し、EntityからStockTaskへの変換が正しく行われること", async () => {
			const mockRepoResponse: TaskLogEntity[] = [
				{
					id: "1",
					task_date: "2024-01-01",
					block_color: "blue",
					created_at: Date.now().toString(),
					task_name: "Task 1",
					status: "pending",
				},
				{
					id: "2",
					task_date: "2024-01-02",
					block_color: "red",
					created_at: Date.now().toString(),
					task_name: "Task 2",
					status: "completed",
				},
			];

			mockRepositoryMethods.findAll.mockResolvedValue(mockRepoResponse);

			// 💡 修正: fakeSupabase と dummyUserId を注入
			const result = await getStockTasks(fakeSupabase, dummyUserId);

			expect(mockRepositoryMethods.findAll).toHaveBeenCalledWith(dummyUserId);
			expect(result).toEqual([
				{
					id: "1",
					content: "Task 1",
					date: "2024-01-01",
					colorName: "blue",
					status: "pending",
				},
				{
					id: "2",
					content: "Task 2",
					date: "2024-01-02",
					colorName: "red",
					status: "completed",
				},
			]);
		});

		it("エラー発生時、例外をスローすること", async () => {
			const mockError = new Error("Database error");
			mockRepositoryMethods.findAll.mockRejectedValue(mockError);

			await expect(getStockTasks(fakeSupabase, dummyUserId)).rejects.toThrow(
				"Database error",
			);
		});
	});

	describe("deleteStockTask", () => {
		it("エラー発生時、例外をスローすること", async () => {
			const mockError = new Error("Database error");
			mockRepositoryMethods.delete.mockRejectedValue(mockError);

			await expect(deleteStockTask(fakeSupabase, "1")).rejects.toThrow(
				"Database error",
			);
		});
	});
});
