import type { ColorName, ColorTheme } from "../stock/types";

export const BLOCK_COLORS: Record<ColorName, ColorTheme> = {
  Green: {
    bg: "bg-emerald-400",
    shadow: "bg-emerald-600",
    border: "border-emerald-700",
    text: "text-emerald-900",
  },
  Yellow: {
    bg: "bg-amber-400",
    shadow: "bg-amber-600",
    border: "border-amber-700",
    text: "text-amber-900",
  },
  Blue: {
    bg: "bg-sky-400",
    shadow: "bg-sky-600",
    border: "border-sky-700",
    text: "text-sky-900",
  },
  Red: {
    bg: "bg-rose-400",
    shadow: "bg-rose-600",
    border: "border-rose-700",
    text: "text-rose-900",
  },
  Purple: {
    bg: "bg-violet-400",
    shadow: "bg-violet-600",
    border: "border-violet-700",
    text: "text-violet-900",
  },
} as const;
