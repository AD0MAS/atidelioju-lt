import type { Task } from "../types/Task";
import TaskItem from "./TaskItem";
import styles from "./TaskList.module.css";

interface TaskListProps {
  /** Already filtered/sorted tasks to render. */
  tasks: Task[];
  /** Whether there are ANY tasks at all (unfiltered) — distinguishes "no tasks yet" from "no matches". */
  hasAnyTasks: boolean;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (task: Task) => void;
  onToggleChecklistItem: (taskId: number, itemId: number) => void;
  now: Date;
}

/** Renders the task list, or an empty-state message when there's nothing to show. */
function TaskList({
  tasks,
  hasAnyTasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onToggleChecklistItem,
  now,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className={styles.emptyState}>
        {hasAnyTasks
          ? "No tasks match your search or filters."
          : "No tasks yet — add your first one above to get started."}
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onToggleChecklistItem={onToggleChecklistItem}
          now={now}
        />
      ))}
    </ul>
  );
}

export default TaskList;
