/**
 * The day a write is dated with. An ISO string cut to its first ten characters reads like today
 * and is the date in UTC: at 01:09 CEST on 2026-09-14 it still said the 13th, and a research
 * splice was filed under the previous day's changelog entry. A date the owner reads as "when this
 * happened" is the local calendar day, and every tool that writes one takes `--today YYYY-MM-DD`
 * so a run can be pinned.
 */
export function localToday(d = new Date()) {
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
