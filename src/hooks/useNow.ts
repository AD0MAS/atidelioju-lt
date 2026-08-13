import { useState, useEffect } from "react";

/**
 * Returns the current time, refreshed on an interval.
 *
 * Needed because React only re-renders on state/prop changes — without this,
 * a task wouldn't visually flip to "overdue" until *something else* triggered
 * a re-render (e.g. a click or page reload).
 *
 * @param intervalMs How often to refresh (default 15s — plenty for minute-level precision).
 */
export function useNow(intervalMs = 15000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id); // avoid leaking timers across mounts/unmounts
  }, [intervalMs]);

  return now;
}
