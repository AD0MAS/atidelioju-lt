import { useState, useEffect } from "react";
import type { Task } from "./types/Task";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import styles from "./App.module.css";
import { useNow } from "./hooks/useNow";
import type { Theme } from "./types/Theme";
import type { CategoryFilter } from "./constants/categories";
import type { NewTaskData } from "./components/TaskForm";

const STORAGE_KEY = "task-tracker-tasks";
const THEME_KEY = "task-tracker-theme";
const CATEGORY_KEY = "task-tracker-category"; 

/** Lazy initializer for the tasks state — reads once on mount, falls back to [] if empty/corrupted. */
function loadTasks(): Task[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as Task[];
  } catch {
    return [];
  }
}

function loadTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "dark" ? "dark" : "light";
}

function loadCategory(): CategoryFilter {
  const stored = localStorage.getItem(CATEGORY_KEY);
  return (stored ?? "all") as CategoryFilter;
}

/**
 * App root: owns all shared state (tasks, theme, active category) and the
 * localStorage persistence for each. Everything else is passed down as props.
 */
function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [theme, setTheme] = useState<Theme>(loadTheme);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(loadCategory);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const now = useNow(); // drives live overdue updates across the app

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(CATEGORY_KEY, activeCategory);
  }, [activeCategory]);

  function addTask(newTask: NewTaskData) {
    const task: Task = { ...newTask, id: Date.now(), completed: false };
    setTasks((prev) => [...prev, task]);
  }

  /**
   * Updates a task's fields. If it has a checklist, `completed` is recalculated
   * from the checklist items rather than trusting the old value — otherwise a
   * task could stay "completed" after adding a new, unchecked item in edit mode.
   */
  function editTask(id: number, updatedData: NewTaskData) {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const hasChecklist = (updatedData.checklist?.length ?? 0) > 0;
        const completed = hasChecklist
          ? updatedData.checklist!.every((item) => item.completed)
          : task.completed;

        return { ...task, ...updatedData, completed };
      })
    );
  }

  /** Toggling the main checkbox also syncs every checklist item to the same state. */
  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const newCompleted = !task.completed;
        const updatedChecklist = task.checklist
          ? task.checklist.map((item) => ({ ...item, completed: newCompleted }))
          : task.checklist;
        return {
          ...task,
          completed: newCompleted,
          checklist: updatedChecklist,
        };
      })
    );
  }

  /** Toggling a single checklist item recalculates the parent task's completed state. */
  function toggleChecklistItem(taskId: number, itemId: number) {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId || !task.checklist) return task;
        const updatedChecklist = task.checklist.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const allCompleted = updatedChecklist.every((item) => item.completed);
        return {
          ...task,
          checklist: updatedChecklist,
          completed: allCompleted,
        };
      })
    );
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <div>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className={styles.appLayout}>
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className={styles.main}>
          <Dashboard tasks={tasks} now={now} />
          <Tasks
            tasks={tasks}
            activeCategory={activeCategory}
            now={now}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onEditTask={editTask}
            onToggleChecklistItem={toggleChecklistItem}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
