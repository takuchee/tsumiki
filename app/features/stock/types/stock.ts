export interface StockItem {
  id: string;
  content: string;
  date: string;
  colorIdx: number;
  status: "pending" | "completed";
}

export type BlockColor = {
  id: number;
  bg: string;
  shadow: string;
  border: string;
  text: string;
  name: string;
};
