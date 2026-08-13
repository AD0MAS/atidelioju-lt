import type { Task } from "../types/Task";
import StatCard from "../components/StatCard";
import styles from "./Dashboard.module.css";
import { isOverdue } from "../utils/taskHelpers";

interface DashboardProps {
  tasks: Task[];
  now: Date;
}

/** Stat strip (Total/Active/Completed/Overdue) — all values derived from `tasks`, nothing stored separately. */
function Dashboard({ tasks, now }: DashboardProps) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;
  const overdue = tasks.filter((task) => isOverdue(task, now)).length;

  return (
    <div className={styles.stats}>
      <StatCard label="Total" value={total} />
      <StatCard label="Active" value={active} />
      <StatCard label="Completed" value={completed} />
      <StatCard label="Overdue" value={overdue} />
    </div>
  );
}

export default Dashboard;
