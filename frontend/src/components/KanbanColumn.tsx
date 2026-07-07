import { assignTask, updateTaskStatus } from "../services/task.service";
import Comments from "./Comments";

interface KanbanColumnProps {
  title: string;
  tasks: any[];
  onTaskUpdated: () => void;
}

export default function KanbanColumn({
  title,
  tasks,
  onTaskUpdated,
}: KanbanColumnProps) {

  const changeStatus = async (
    taskId: string,
    status: string
  ) => {

    await updateTaskStatus(taskId, status);

    onTaskUpdated();

  };

  const handleAssign = async (
    taskId: string,
    userId: string
  ) => {

    await assignTask(taskId, userId);

    onTaskUpdated();

  };

  return (
    <div className="bg-gray-100 rounded-xl p-4 min-h-[500px]">

      <h2 className="text-xl font-bold mb-5">
        {title}
      </h2>

      <div className="space-y-4">

        {tasks.map((task) => (

          <div
            key={task._id}
            className="bg-white rounded-lg shadow p-4"
          >

            <h3 className="font-semibold">
              {task.title}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {task.description}
            </p>

            <select
              className="mt-4 border rounded p-2 w-full"
              value={task.status}
              onChange={(e) =>
                changeStatus(
                  task._id,
                  e.target.value
                )
              }
            >
              <option value="TODO">
                TODO
              </option>

              <option value="IN_PROGRESS">
                IN PROGRESS
              </option>

              <option value="DONE">
                DONE
              </option>

            </select>

            <select
              className="mt-2 border rounded p-2 w-full"
              value={task.assignedTo?._id || ""}
              onChange={(e) =>
                handleAssign(
                  task._id,
                  e.target.value
                )
              }
            >
              <option value="">
                Assign Member
              </option>

              <option value="6a4552bdd8adf168d5302853">
                Sanjay
              </option>

            </select>

            {task.assignedTo && (
              <p className="text-sm text-blue-600 mt-2">
                👤 Assigned to: {task.assignedTo.name}
              </p>
            )}

            <Comments taskId={task._id} />

          </div>

        ))}

      </div>

    </div>
  );
}