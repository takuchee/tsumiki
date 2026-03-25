/**
 * ストック機能に関する型定義(アプリケーション側)
 */

/**
 * アプリケーション内部で扱うタスク型
 */
export type StockTask = {
  id: string;
  content: string;
  date: string;
  colorName: ColorName;
  status: "pending" | "completed";
};

export type ColorName = "Green" | "Yellow" | "Blue" | "Red" | "Purple";
export type ColorTheme = {
  bg: string;
  shadow: string;
  border: string;
  text: string;
};
