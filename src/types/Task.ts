import type { Category } from "../constants/categories";
import type { Priority } from "../constants/priorities";

/** A single item within a task's optional checklist (e.g. a shopping list entry). */
export interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

/**
 * Core task entity used throughout the app.
 * `checklist` is optional — most tasks don't have one.
 * `completed` is derived automatically when a checklist exists (see App.tsx editTask/toggleTask).
 */
export interface Task {
  id: number;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string; // ISO 8601, e.g. "2026-08-15T14:30"
  completed: boolean;
  checklist?: ChecklistItem[];
}
