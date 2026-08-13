import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  value: number;
}

/** Single dashboard stat tile (e.g. "12 / Total"). */
function StatCard({ label, value }: StatCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </div>
  );
}

export default StatCard;
