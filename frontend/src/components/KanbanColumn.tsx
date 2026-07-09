import { useState } from "react";
import { assignTask, updateTaskStatus } from "../services/task.service";
import Comments from "./Comments";

interface KanbanColumnProps {
  title: string;
  tasks: any[];
  onTaskUpdated: () => void;
}

const statusColors: Record<string, string> = {
  TODO: "bg-slate-700 text-slate-300",
  IN_PROGRESS: "bg-blue-900/50 text-blue-300",
  DONE: "bg-emerald-900/50 text-emerald-300",
};

const priorityColors: Record<string, string> = {
  HIGH: "text-red-400",
  MEDIUM: "text-yellow-400",
  LOW: "text-slate-400",
};

export default function KanbanColumn({ title, tasks, onTaskUpdated }: KanbanColumnProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const changeStatus = async (taskId: string, status: string) => {
    await updateTaskStatus(taskId, status);
    onTaskUpdated();
  };

  const handleAssign = async (taskId: string, userId: string) => {
    await assignTask(taskId, userId);
    onTaskUpdated();
  };

  const columnHeaderColors: Record<string, string> = {
    TODO: "border-slate-600",
    "IN PROGRESS": "border-blue-500",
    DONE: "border-emerald-500",
  };

  return (
    <div className={`bg-slate-800/50 rounded-xl border-t-2 ${columnHeaderColors[title] || "border-slate-600"} p-4 min-h-[500px]`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          {title}
        </h2>
        <span className="bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task._id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-white text-sm leading-snug">{task.title}</h3>
              {task.priority && (
                <span className={`text-xs font-medium shrink-0 ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-slate-500 text-xs mt-1.5 line-clamp-2">{task.description}</p>
            )}

            {task.assignedTo && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {task.assignedTo.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-slate-400">{task.assignedTo.name}</span>
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <select
                className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                value={task.status}
                onChange={(e) => changeStatus(task._id, e.target.value)}
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>

              <select
                className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                value={task.assignedTo?._id || ""}
                onChange={(e) => handleAssign(task._id, e.target.value)}
              >
                <option value="">Assign...</option>
                <option value="6a4552bdd8adf168d5302853">Sanjay</option>
              </select>
            </div>

            <button
              onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
              className="mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              {expandedTask === task._id ? "▲ Hide comments" : "▼ Comments"}
            </button>

            {expandedTask === task._id && <Comments taskId={task._id} />}
          </div>
        ))}
      </div>
    </div>
  );
}
