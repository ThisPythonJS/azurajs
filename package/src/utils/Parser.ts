export function parseQS(qs: string): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  if (!qs) return out;
  const parts = qs.replace(/^\?/, "").split("&");
  for (const p of parts) {
    if (!p) continue;
    const idx = p.indexOf("=");
    const k = idx === -1 ? decodeURIComponent(p) : decodeURIComponent(p.slice(0, idx));
    const v = idx === -1 ? "" : decodeURIComponent(p.slice(idx + 1));
    if (Object.prototype.hasOwnProperty.call(out, k)) {
      const cur = out[k];
      if (Array.isArray(cur)) cur.push(v);
      else out[k] = [cur as string, v];
    } else {
      out[k] = v;
    }
  }
  return out;
}
