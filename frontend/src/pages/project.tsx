import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { getTasks } from "../services/task.service";

import KanbanColumn from "../components/KanbanColumn";
import CreateTaskModal from "../components/CreateTaskModal";

export default function Project() {

  const { projectId } = useParams();

  const [tasks, setTasks] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    if (projectId) {

      loadTasks();

    }

  }, [projectId]);

  const loadTasks = async () => {

    if (!projectId) return;

    const data = await getTasks(projectId);

    setTasks(data);

  };

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO"
  );

  const progressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  );

  const doneTasks = tasks.filter(
    (task) => task.status === "DONE"
  );

  return (

    <MainLayout>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">

          Project Board

        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Task
        </button>

      </div>

      <div className="grid grid-cols-3 gap-6">

        <KanbanColumn
          title="TODO"
          tasks={todoTasks}
          onTaskUpdated={loadTasks}
        />

        <KanbanColumn
          title="IN PROGRESS"
          tasks={progressTasks}
          onTaskUpdated={loadTasks}
        />

        <KanbanColumn
          title="DONE"
          tasks={doneTasks}
          onTaskUpdated={loadTasks}
        />

      </div>

      {showModal && projectId && (

        <CreateTaskModal
          projectId={projectId}
          onClose={() => setShowModal(false)}
          onTaskCreated={loadTasks}
        />

      )}

    </MainLayout>

  );

}