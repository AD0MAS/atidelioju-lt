import { useState } from "react";
import type { Task } from "../types/Task";
import styles from "./TaskItem.module.css";
import { isOverdue, formatDueDate } from "../utils/taskHelpers";
import ConfirmDialog from "./ConfirmDialog";

interface TaskItemProps {
  task: Task;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (task: Task) => void;
  onToggleChecklistItem: (taskId: number, itemId: number) => void;
  /** Current time, passed down so overdue styling updates live (see useNow). */
  now: Date;
}

/** Single row in the task list: checkbox, title/meta, expandable description/checklist, and actions. */
function TaskItem({
  task,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onToggleChecklistItem,
  now,
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const overdue = isOverdue(task, now);
  const hasChecklist = (task.checklist?.length ?? 0) > 0;
  const hasExpandableContent = Boolean(task.description) || hasChecklist;

  // "2/4 checked" summary shown in the meta line when a checklist exists.
  const checklistProgress = hasChecklist
    ? `${task.checklist!.filter((i) => i.completed).length}/${task.checklist!.length}`
    : null;

  function handleConfirmDelete() {
    onDeleteTask(task.id);
    setIsConfirmingDelete(false);
  }

  return (
    <li className={styles.item}>
      <div className={styles.row}>
        {/*
          Wrapping checkbox + title/meta in a <label> lets clicking anywhere on the
          text toggle completion too — not just the small checkbox itself.
          Action buttons stay OUTSIDE the label so they don't also trigger the toggle.
        */}
        <label className={styles.taskLabel}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(task.id)}
          />
          <div className={styles.info}>
            <p
              className={
                overdue ? `${styles.title} ${styles.overdueText}` : styles.title
              }
            >
              {task.title}
            </p>
            <p className={styles.meta}>
              {task.category} • {task.priority} •{" "}
              <span className={overdue ? styles.overdueText : undefined}>
                Due: {formatDueDate(task.dueDate)}
              </span>
              {checklistProgress && ` • ${checklistProgress} checked`}
            </p>
          </div>
        </label>

        {hasExpandableContent && (
          <button
            className={styles.expandButton}
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-label={isExpanded ? "Hide details" : "Show details"}
          >
            {isExpanded ? "▲" : "▼"}
          </button>
        )}

        <button
          className={styles.editButton}
          onClick={() => onEditTask(task)}
          aria-label="Edit task"
        >
          ⚙
        </button>

        {/* Opens a confirmation dialog instead of deleting immediately */}
        <button
          className={styles.deleteButton}
          onClick={() => setIsConfirmingDelete(true)}
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>

      {isExpanded && (
        <div className={styles.expandedContent}>
          {task.description && (
            <p className={styles.description}>{task.description}</p>
          )}

          {hasChecklist && (
            <ul className={styles.checklist}>
              {task.checklist!.map((item) => (
                <li key={item.id} className={styles.checklistItem}>
                  <label className={styles.checklistLabel}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => onToggleChecklistItem(task.id, item.id)}
                      aria-label={`Mark "${item.text}" as complete`}
                    />
                    <span
                      className={
                        item.completed
                          ? `${styles.checklistText} ${styles.checklistDone}`
                          : styles.checklistText
                      }
                    >
                      {item.text}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isConfirmingDelete && (
        <ConfirmDialog
          title="Delete task?"
          message={`"${task.title}" will be permanently deleted.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}
    </li>
  );
}

export default TaskItem;
