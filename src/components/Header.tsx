import type { Theme } from "../types/Theme";
import styles from "./Header.module.css";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  /** Only relevant on mobile — toggles the Sidebar drawer (hamburger is hidden on desktop via CSS). */
  onToggleSidebar: () => void;
}

/** Top bar: app title, mobile menu toggle, and dark/light mode switch. */
function Header({ theme, onToggleTheme, onToggleSidebar }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.hamburger}
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <h1 className={styles.title}>Atidelioju.lt</h1>
      </div>
      <button 
        className={styles.themeToggle} 
        onClick={onToggleTheme}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </header>
  );
}

export default Header;
