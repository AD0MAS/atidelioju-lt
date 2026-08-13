/** Fixed set of task categories. Add/remove here to change them everywhere in the app. */
export const CATEGORIES = [
  "Personal",
  "Learning",
  "Work",
  "Fitness",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Category type used for Sidebar filtering, which also allows "all" to show everything. */
export type CategoryFilter = Category | "all";