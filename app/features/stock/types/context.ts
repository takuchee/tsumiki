/**
 * コンテキストの型定義
 */

import type { ColorName, StockTask } from "./stock";

export type StockContextType = {
	allTasks: StockTask[];
	setAllTasks: React.Dispatch<React.SetStateAction<StockTask[]>>;
	targetDate: string;
	setTargetDate: (date: string) => void;
	selectedColor: ColorName;
	setSelectedColor: (color: ColorName) => void;
};
