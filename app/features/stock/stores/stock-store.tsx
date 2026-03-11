import { createContext, useContext, useState } from 'react';
import type { ColorName, StockContextType, TaskLog } from '../types';

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider = ({
  children,
  initialLogs = []
}: {
  children: React.ReactNode;
  initialLogs?: TaskLog[]
}) => {
  const [allTasks, setAllTasks] = useState<TaskLog[]>(initialLogs);
  const [targetDate, setTargetDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [selectedColor, setSelectedColor] = useState<ColorName>("Green");


  return (
    <StockContext.Provider value={{
      allTasks,
      setAllTasks,
      targetDate,
      setTargetDate,
      selectedColor,
      setSelectedColor
    }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStockContext must be used within a StockProvider');
  }
  return context;
};