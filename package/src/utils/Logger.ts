export function logger(level: "info" | "warn" | "error", msg: string) {
  if (level === "error") console.error("[Azura]", msg);
  else if (level === "warn") console.warn("[Azura]", msg);
  else console.log("[Azura]", msg);
}
