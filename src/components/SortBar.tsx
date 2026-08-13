import styles from "./SortBar.module.css";

export type SortType = "dueDate" | "priority" | "newest" | "oldest";

interface SortBarProps {
  value: SortType;
  onChange: (value: SortType) => void;
}

/** Dropdown for choosing how the task list is sorted. */
function SortBar({ value, onChange }: SortBarProps) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(e) => onChange(e.target.value as SortType)}
    >
      <option value="dueDate">Due date</option>
      <option value="priority">Priority</option>
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
    </select>
  );
}

export default SortBar;
