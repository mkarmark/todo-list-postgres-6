"use client";
import { useEffect, useState } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch todos
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/todo");
      const data = await res.json();
      setTodos(data);
    } catch (e) {
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      setTitle("");
      fetchTodos();
    } catch (e) {
      setError("Failed to add todo");
    } finally {
      setLoading(false);
    }
  }

  async function removeTodo(id: number) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/todo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to remove todo");
      fetchTodos();
    } catch (e) {
      setError("Failed to remove todo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">My Todo List</h1>
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add a new todo..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={loading || !title.trim()}
          >
            Add
          </button>
        </form>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <ul className="space-y-2">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
              <span className="text-gray-800">{todo.title}</span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-red-500 hover:text-red-700 transition"
                disabled={loading}
                aria-label={`Remove ${todo.title}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
        {loading && <div className="text-gray-400 mt-4 text-center">Loading...</div>}
        {!loading && todos.length === 0 && <div className="text-gray-400 mt-4 text-center">No todos yet.</div>}
      </div>
      <footer className="mt-8 text-gray-400 text-sm">&copy; {new Date().getFullYear()} My Todo List</footer>
    </main>
  );
}
