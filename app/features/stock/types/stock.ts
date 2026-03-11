export interface StockItem {
  id: string;
  content: string;
  date: string;
  colorIdx: number;
  status: "pending" | "completed";
}

export type ColorName = "Green" | "Yellow" | "Blue" | "Red" | "Purple";
export type ColorTheme = {
  bg: string;
  shadow: string;
  border: string;
  text: string;
};
