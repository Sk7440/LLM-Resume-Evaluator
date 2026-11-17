import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#172033", line: "#E2E8F0", mint: "#10B981" } } },
  plugins: [],
};
export default config;
