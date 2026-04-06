import { beforeEach, describe, expect, it, vi } from "vitest";
import { taskLogRepository } from "../repository/stock-repository";
import type { ColorName, StockTask, TaskLogEntity } from "../types";
import {
	createStockTask,
	deleteStockTask,
	getStockTasks,
	updateStockTaskStatus,
} from "../usecases";

// repositoryをモック化
vi.mock("../repository/stock-repository", () => ({
	taskLogRepository: {
		create: vi.fn(),
		update: vi.fn(),
		findAll: vi.fn(),
		delete: vi.fn(),
	},
}));

// テストの前にモックをクリアする
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

		vi.mocked(taskLogRepository.create).mockResolvedValue(mockRepoResponse);

		const result = await createStockTask(mockInput);

		expect(taskLogRepository.create).toHaveBeenCalledWith({
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

	//  block_colorがnullのケースもテスト
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

		vi.mocked(taskLogRepository.create).mockResolvedValue(mockRepoResponse);

		const result = await createStockTask(mockInput);

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
		vi.mocked(taskLogRepository.create).mockRejectedValue(mockError);

		await expect(createStockTask(mockInput)).rejects.toThrow("Database error");
	});
});

describe("updateStockTaskStatus", () => {
	it("ステータスの更新に成功し、変換されたタスクを返すこと", async () => {
		const mockId = "1";
		const mockNewStatus = "completed";
		const mockRepoResponse: TaskLogEntity = {
			id: mockId,
			task_date: new Date().toISOString().split("T")[0],
			block_color: "red",
			created_at: Date.now().toString(),
			task_name: "Test Task",
			status: mockNewStatus,
		};

		vi.mocked(taskLogRepository.update).mockResolvedValue(mockRepoResponse);

		const result = await updateStockTaskStatus(mockId, mockNewStatus);

		expect(taskLogRepository.update).toHaveBeenCalledWith(mockId, {
			status: mockNewStatus,
		});
		expect(result.id).toBe(mockId);
		expect(result.status).toBe("completed");
	});

	it("エラー発生時、例外をスローすること", async () => {
		// 準備
		const mockError = new Error("Database error");
		vi.mocked(taskLogRepository.update).mockRejectedValue(mockError);

		await expect(updateStockTaskStatus("1", "completed")).rejects.toThrow(
			"Database error",
		);
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

		vi.mocked(taskLogRepository.findAll).mockResolvedValue(mockRepoResponse);

		const result = await getStockTasks();
		expect(taskLogRepository.findAll).toHaveBeenCalled();
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
		vi.mocked(taskLogRepository.findAll).mockRejectedValue(mockError);
		await expect(getStockTasks()).rejects.toThrow("Database error");
	});
});

// 削除時エラーのテストだけ確認
describe("deleteStockTask", () => {
	it("エラー発生時、例外をスローすること", async () => {
		const mockError = new Error("Database error");
		vi.mocked(taskLogRepository.delete).mockRejectedValue(mockError);
		await expect(deleteStockTask("1")).rejects.toThrow("Database error");
	});
});
