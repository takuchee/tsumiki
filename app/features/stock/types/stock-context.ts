import type { TaskLog } from "./task-log";
import type { ColorName } from "./stock";

export type StockContextType = {
  allTasks: TaskLog[];
  setAllTasks: React.Dispatch<React.SetStateAction<TaskLog[]>>;
  targetDate: Date;
  setTargetDate: (date: Date) => void;
  selectedColor: ColorName;
  setSelectedColor: (color: ColorName) => void;
};
