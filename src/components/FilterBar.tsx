import { FILTERS, type FilterType } from "../constants/filters";
import styles from "./FilterBar.module.css";

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

/** Status filter toggle (All / Active / Completed / Overdue). */
function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      {FILTERS.map((filter) => (
        <button
          key={filter}
          className={
            filter === activeFilter
              ? `${styles.filterButton} ${styles.active}`
              : styles.filterButton
          }
          onClick={() => onFilterChange(filter)}
        >
          {/* Capitalize for display; the underlying value stays lowercase */}
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
