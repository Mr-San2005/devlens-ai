import { useEffect, useState } from "react";

import {
  createComment,
  getComments,
} from "../services/comment.service";

interface Props {
  taskId: string;
}

export default function Comments({
  taskId,
}: Props) {
  const [comments, setComments] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    const data = await getComments(taskId);
    setComments(data);
  };

  const handleComment = async () => {
    if (!message.trim()) return;

    await createComment(message, taskId);

    setMessage("");

    loadComments();
  };

  return (
    <div className="mt-4">

      <div className="space-y-2">

        {comments.map((comment) => (

          <div
            key={comment._id}
            className="bg-gray-100 rounded p-2"
          >

            <p className="font-semibold">
              {comment.author.name}
            </p>

            <p>
              {comment.message}
            </p>

          </div>

        ))}

      </div>

      <div className="flex gap-2 mt-3">

        <input
          className="border rounded p-2 flex-1"
          placeholder="Add comment..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
        />

        <button
          onClick={handleComment}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>

      </div>

    </div>
  );
}