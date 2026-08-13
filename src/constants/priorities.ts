/** Fixed priority levels, ordered low → high (order matters for sorting logic). */
export const PRIORITIES = ["low", "medium", "high"] as const;

export type Priority = (typeof PRIORITIES)[number];