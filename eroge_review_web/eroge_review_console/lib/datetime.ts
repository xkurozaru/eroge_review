import { format, isValid, parseISO } from "date-fns";

export function formatDateTime(value?: string | null): string {
  if (!value) return "";
  const parsed = parseISO(value);
  if (!isValid(parsed)) return "";
  return format(parsed, "yyyy/MM/dd HH:mm");
}
