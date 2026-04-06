import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"], // テキスト(コンソール)とHTML形式で出す
      include: ["features/**/*"], // 計測対象をfeatures配下に絞る
      exclude: ["node_modules/**", "features/**/*.test.ts"], // テスト自体は除外
    },
  },
});
