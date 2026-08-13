import { CATEGORIES, type CategoryFilter } from "../constants/categories";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  /** Whether the mobile drawer is open — ignored on desktop, where the sidebar is always visible via CSS. */
  isOpen: boolean;
  onClose: () => void;
}

/** Category navigation. Doubles as a slide-in drawer on mobile (see .module.css for the breakpoint). */
function Sidebar({
  activeCategory,
  onCategoryChange,
  isOpen,
  onClose,
}: SidebarProps) {
  /** Selecting a category also closes the mobile drawer, so the filtered list is immediately visible. */
  function handleCategoryClick(category: CategoryFilter) {
    onCategoryChange(category);
    onClose();
  }

  return (
    <>
      {/* Dimmed backdrop, mobile only (see CSS) — clicking it closes the drawer */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside
        className={isOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar}
      >
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Categories</p>
          <ul className={styles.navList}>
            <li>
              <button
                className={
                  activeCategory === "all"
                    ? `${styles.navItem} ${styles.active}`
                    : styles.navItem
                }
                onClick={() => handleCategoryClick("all")}
              >
                All
              </button>
            </li>
            {CATEGORIES.map((category) => (
              <li key={category}>
                <button
                  className={
                    activeCategory === category
                      ? `${styles.navItem} ${styles.active}`
                      : styles.navItem
                  }
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
