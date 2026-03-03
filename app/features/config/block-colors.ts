import type { BlockColor } from "../stock/types/stock";

export const BLOCK_COLORS: readonly BlockColor[] = [
  {
    id: 0,
    bg: "bg-emerald-400",
    shadow: "bg-emerald-600",
    border: "border-emerald-700",
    text: "text-emerald-900",
    name: "Green",
  },
  {
    id: 1,
    bg: "bg-amber-400",
    shadow: "bg-amber-600",
    border: "border-amber-700",
    text: "text-amber-900",
    name: "Yellow",
  },
  {
    id: 2,
    bg: "bg-sky-400",
    shadow: "bg-sky-600",
    border: "border-sky-700",
    text: "text-sky-900",
    name: "Blue",
  },
  {
    id: 3,
    bg: "bg-rose-400",
    shadow: "bg-rose-600",
    border: "border-rose-700",
    text: "text-rose-900",
    name: "Red",
  },
  {
    id: 4,
    bg: "bg-violet-400",
    shadow: "bg-violet-600",
    border: "border-violet-700",
    text: "text-violet-900",
    name: "Purple",
  },
] as const;
