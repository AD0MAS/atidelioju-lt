/** Task status filters used by FilterBar and Tasks page. */
export const FILTERS = ["all", "active", "completed", "overdue"] as const;

export type FilterType = (typeof FILTERS)[number];
