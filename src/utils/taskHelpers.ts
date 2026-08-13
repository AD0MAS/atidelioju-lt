import type { Task } from "../types/Task";
import { PRIORITIES, type Priority } from "../constants/priorities";

/**
 * Whether a task is overdue: not completed and its due date/time has already passed.
 * `now` is injected (not read internally via `new Date()`) so callers can drive
 * re-renders via the `useNow` hook — see that hook for why this matters.
 */
export function isOverdue(task: Task, now: Date): boolean {
  if (!task.dueDate) return false;
  return !task.completed && new Date(task.dueDate) < now;
}

/** Formats an ISO due date/time string into a human-readable label, e.g. "Aug 15, 2:30 PM". */
export function formatDueDate(dueDate: string): string {
  if (!dueDate) return "";
  const date = new Date(dueDate);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Numeric weight for each priority, derived from PRIORITIES order (low=1 ... high=3).
 * Used by Tasks.tsx when sorting by priority.
 */
export const priorityWeight: Record<Priority, number> = Object.fromEntries(
  PRIORITIES.map((priority, index) => [priority, index + 1])
) as Record<Priority, number>;