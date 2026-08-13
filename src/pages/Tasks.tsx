import { useState, useRef, useEffect } from "react";
import type { Task } from "../types/Task";
import TaskList from "../components/TaskList";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import type { FilterType } from "../constants/filters";
import TaskForm, { type NewTaskData } from "../components/TaskForm";
import SortBar, { type SortType } from "../components/SortBar";
import Modal from "../components/Modal";
import styles from "./Tasks.module.css";
import type { CategoryFilter } from "../constants/categories";
import { priorityWeight, isOverdue } from "../utils/taskHelpers";

interface TasksProps {
  tasks: Task[];
  activeCategory: CategoryFilter;
  onAddTask: (newTask: NewTaskData) => void;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (id: number, updatedData: NewTaskData) => void;
  onToggleChecklistItem: (taskId: number, itemId: number) => void;
  now: Date;
}

/** Strips id/completed off a Task so it can prefill the (create/edit-shared) TaskForm. */
function getEditFormData(task: Task): NewTaskData {
  return {
    title: task.title,
    description: task.description,
    category: task.category,
    priority: task.priority,
    dueDate: task.dueDate,
    checklist: task.checklist ?? [],
  };
}

/**
 * Main task list page: search/filter/sort toolbar, the list itself, and the
 * Add/Edit task modals. Category filtering comes from the Sidebar via props.
 */
function Tasks({
  tasks,
  activeCategory,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onToggleChecklistItem,
  now,
}: TasksProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("dueDate");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const tasksSectionRef = useRef<HTMLDivElement>(null);
  // Tracks the previous category so we only auto-scroll on an actual change,
  // not on mount/reload (where activeCategory is restored but unchanged).
  const prevCategoryRef = useRef(activeCategory);

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((task) => {
      if (activeFilter === "active") return !task.completed;
      if (activeFilter === "completed") return task.completed;
      if (activeFilter === "overdue") return isOverdue(task, now);
      return true;
    })
    .filter((task) =>
      activeCategory === "all" ? true : task.category === activeCategory
    )
    .sort((a, b) => {
      if (sortBy === "dueDate") return a.dueDate.localeCompare(b.dueDate);
      if (sortBy === "priority")
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      if (sortBy === "newest") return b.id - a.id;
      if (sortBy === "oldest") return a.id - b.id;
      return 0;
    });

  // Scroll the task list into view when the selected category changes
  // (mainly useful on mobile, where picking a category isn't otherwise visible).
  useEffect(() => {
    if (prevCategoryRef.current !== activeCategory) {
      tasksSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    prevCategoryRef.current = activeCategory;
  }, [activeCategory]);

  function handleAddTask(newTask: NewTaskData) {
    onAddTask(newTask);
    setIsFormOpen(false);
  }

  function handleSaveEdit(updatedData: NewTaskData) {
    if (!editingTask) return;
    onEditTask(editingTask.id, updatedData);
    setEditingTask(null);
  }

  return (
    <div ref={tasksSectionRef}>
      <div className={styles.tasksHeader}>
        <h2>Tasks</h2>
        <button
          className={styles.addTaskButton}
          onClick={() => setIsFormOpen(true)}
        >
          + Add Task
        </button>
      </div>

      <div className={styles.toolbar}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <SortBar value={sortBy} onChange={setSortBy} />
      </div>

      <TaskList
        tasks={filteredTasks}
        hasAnyTasks={tasks.length > 0}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onEditTask={setEditingTask}
        onToggleChecklistItem={onToggleChecklistItem}
        now={now}
      />

      {isFormOpen && (
        <Modal onClose={() => setIsFormOpen(false)}>
          <h3 className={styles.modalTitle}>Add New Task</h3>
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setIsFormOpen(false)}
          />
        </Modal>
      )}

      {editingTask && (
        <Modal onClose={() => setEditingTask(null)}>
          <h3 className={styles.modalTitle}>Edit Task</h3>
          <TaskForm
            initialData={getEditFormData(editingTask)}
            onSubmit={handleSaveEdit}
            onCancel={() => setEditingTask(null)}
            submitLabel="Save Changes"
          />
        </Modal>
      )}
    </div>
  );
}

export default Tasks;
