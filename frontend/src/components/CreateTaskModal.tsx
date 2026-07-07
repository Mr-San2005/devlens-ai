import { useState } from "react";
import { createTask } from "../services/task.service";

interface Props {
  projectId: string;
  onClose: () => void;
  onTaskCreated: () => void;
}

export default function CreateTaskModal({
  projectId,
  onClose,
  onTaskCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    await createTask(
      title,
      description,
      projectId
    );

    onTaskCreated();

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white w-96 rounded-xl p-6">

        <h2 className="text-2xl font-bold mb-5">

          New Task

        </h2>

        <input
          className="w-full border p-3 rounded mb-4"
          placeholder="Task Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          className="w-full border p-3 rounded mb-4"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>

        </div>

      </div>

    </div>
  );
}