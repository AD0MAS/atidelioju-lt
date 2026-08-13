import { useState } from "react";
import type { Task, ChecklistItem } from "../types/Task";
import styles from "./TaskForm.module.css";
import { CATEGORIES } from "../constants/categories";
import { PRIORITIES } from "../constants/priorities";

/** Shape of form data for both creating and editing a task (no id/completed — those are managed elsewhere). */
export type NewTaskData = Omit<Task, "id" | "completed">;

const emptyForm: NewTaskData = {
  title: "",
  description: "",
  category: "Personal",
  priority: "medium",
  dueDate: "",
  checklist: [],
};

interface TaskFormProps {
  /** Pre-fills the form for editing; omitted when creating a new task. */
  initialData?: NewTaskData;
  onSubmit: (data: NewTaskData) => void;
  /** Only shown as a Cancel button when provided (create flow closes via the outer modal instead). */
  onCancel?: () => void;
  submitLabel?: string;
}

/**
 * Shared form for both creating and editing a task.
 * Reused via `initialData`/`submitLabel`/`onCancel` rather than having two separate components.
 */
function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Task",
}: TaskFormProps) {
  const [formData, setFormData] = useState<NewTaskData>(
    initialData ?? emptyForm
  );
  const [newItemText, setNewItemText] = useState(""); // draft text for the next checklist item

  // Due date/time are stored as one ISO string ("YYYY-MM-DDTHH:mm") but edited as two separate inputs.
  const [datePart, timePart] = formData.dueDate
    ? formData.dueDate.split("T")
    : ["", ""];

  const isFormValid = formData.title.trim() !== "" && formData.dueDate !== "";

  /** Generic handler for text/select/textarea fields — relies on `name` matching a NewTaskData key. */
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  /** Recombines the date input with the existing time (defaults to end-of-day if no time set yet). */
  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDate = e.target.value;
    setFormData((prev) => ({
      ...prev,
      dueDate: newDate ? `${newDate}T${timePart || "23:59"}` : "",
    }));
  }

  /** Recombines the time input with the existing date. No-op until a date is picked. */
  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTime = e.target.value;
    if (!datePart) return;
    setFormData((prev) => ({ ...prev, dueDate: `${datePart}T${newTime}` }));
  }

  function handleAddChecklistItem() {
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now(),
      text: newItemText.trim(),
      completed: false,
    };
    setFormData((prev) => ({
      ...prev,
      checklist: [...(prev.checklist ?? []), newItem],
    }));
    setNewItemText("");
  }

  function handleRemoveChecklistItem(id: number) {
    setFormData((prev) => ({
      ...prev,
      checklist: (prev.checklist ?? []).filter((item) => item.id !== id),
    }));
  }

  /** Lets Enter add a checklist item without submitting the whole form. */
  function handleChecklistInputKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddChecklistItem();
    }
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFormValid) return;
    onSubmit(formData);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Title — required */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">
          Task title <span className={styles.required}>*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Enter task title..."
          className={styles.input}
          value={formData.title}
          onChange={handleChange}
          maxLength={80}
          autoFocus
        />
      </div>

      {/* Description — optional */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Add details or notes..."
          className={styles.textarea}
          rows={3}
          value={formData.description}
          onChange={handleChange}
          maxLength={250}
        />
      </div>

      {/* Category — options generated from the shared CATEGORIES constant */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          className={styles.select}
          value={formData.category}
          onChange={handleChange}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Priority — options generated from the shared PRIORITIES constant */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          className={styles.select}
          value={formData.priority}
          onChange={handleChange}
        >
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Due date/time — two native inputs instead of one datetime-local (better cross-browser UI) */}
      <div className={styles.field}>
        <label className={styles.label} id="dueDateLabel">
          Due date <span className={styles.required}>*</span>
        </label>
        <div className={styles.dateTimeRow}>
          <input
            type="date"
            className={styles.input}
            value={datePart}
            onChange={handleDateChange}
            aria-label="Due date"
          />
          <input
            type="time"
            className={styles.input}
            value={timePart || "23:59"}
            onChange={handleTimeChange}
            disabled={!datePart}
            aria-label="Due time"
          />
        </div>
      </div>

      {/* Checklist — optional, freeform list of sub-items (e.g. a shopping list) */}
      <div className={styles.field}>
        <label className={styles.label}>Checklist (optional)</label>

        {(formData.checklist ?? []).length > 0 && (
          <ul className={styles.checklistBuilder}>
            {formData.checklist!.map((item) => (
              <li key={item.id} className={styles.checklistBuilderItem}>
                <span>{item.text}</span>
                <button
                  type="button"
                  className={styles.removeItemButton}
                  onClick={() => handleRemoveChecklistItem(item.id)}
                  aria-label={`Remove ${item.text}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.checklistInputRow}>
          <input
            type="text"
            placeholder="Add checklist item..."
            className={styles.input}
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleChecklistInputKeyDown}
            maxLength={80}
            aria-label="New checklist item"
          />
          {/* type="button" — must not trigger the form's submit */}
          <button
            type="button"
            className={styles.addItemButton}
            onClick={handleAddChecklistItem}
          >
            + Add
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button type="button" className={styles.button} onClick={onCancel}>
            Cancel
          </button>
        )}
        {/* Disabled (not an error message) until required fields are filled — simplest validation UX */}
        <button
          type="submit"
          className={`${styles.button} ${styles.primaryButton}`}
          disabled={!isFormValid}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
