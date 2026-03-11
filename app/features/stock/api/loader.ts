import { taskLogRepository } from "./task-logs";

export const getStockInitialData = async () => {
  const initialLogs = await taskLogRepository.findAll();

  return {
    initialLogs,
  };
};
