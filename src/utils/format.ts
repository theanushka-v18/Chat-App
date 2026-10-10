const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

type TimeValue = number | string | Date | null | undefined;

export const toDate = (value: TimeValue): Date | null => {
  if (value === null || value === undefined || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const startOfDay = (value: TimeValue): number | null => {
  const date = toDate(value);
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

/** Stable key used to group consecutive messages by calendar day. */
export const dayKey = (value: TimeValue): string => {
  const day = startOfDay(value);
  return day === null ? "" : String(day);
};

/** "9:41 AM" */
export const formatTime = (value: TimeValue): string => {
  const date = toDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

/** "Today" / "Yesterday" / "Wednesday" / "12 Mar 2025" */
export const formatDayLabel = (value: TimeValue): string => {
  const date = toDate(value);
  const day = startOfDay(value);
  if (!date || day === null) return "";

  const today = startOfDay(new Date()) ?? 0;
  const diffInDays = Math.round((today - day) / DAY);

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays > 1 && diffInDays < WEEK) {
    return new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(date);
  }

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (date.getFullYear() !== new Date().getFullYear()) options.year = "numeric";
  return new Intl.DateTimeFormat(undefined, options).format(date);
};

/** "just now" / "12m ago" / "3h ago" / "2d ago" */
export const formatRelative = (value: TimeValue): string => {
  const date = toDate(value);
  if (!date) return "";

  const diff = Date.now() - date.getTime();
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < WEEK) return `${Math.floor(diff / DAY)}d ago`;
  return formatDayLabel(date);
};

/** 1200 -> "1.2k" */
export const formatCount = (value: number): string => {
  if (value < 1000) return String(value);
  if (value < 1_000_000) {
    const thousands = value / 1000;
    return `${thousands >= 10 ? Math.round(thousands) : Math.round(thousands * 10) / 10}k`;
  }
  const millions = value / 1_000_000;
  return `${millions >= 10 ? Math.round(millions) : Math.round(millions * 10) / 10}m`;
};

/** "Ada Lovelace" -> "AL", "cher" -> "C" */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || "?";
};

const AVATAR_COLORS = [
  "brand",
  "violet",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "green",
  "grape",
  "pink",
  "orange",
];

/** Deterministic color per user so avatars stay stable between renders. */
export const getAvatarColor = (seed: string): string => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 100_003;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length] ?? "brand";
};
