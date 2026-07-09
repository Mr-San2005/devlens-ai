import { useEffect, useState } from "react";
import { createComment, getComments } from "../services/comment.service";

interface Props {
  taskId: string;
}

export default function Comments({ taskId }: Props) {
  const [comments, setComments] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    const data = await getComments(taskId);
    setComments(data);
  };

  const handleComment = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await createComment(message, taskId);
      setMessage("");
      loadComments();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-3 border-t border-slate-700 pt-3">
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-slate-700/50 rounded-md p-2">
            <p className="text-xs font-medium text-blue-400">{comment.author.name}</p>
            <p className="text-xs text-slate-300 mt-0.5">{comment.message}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-xs text-slate-600 text-center py-2">No comments yet</p>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          placeholder="Add a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleComment()}
        />
        <button
          onClick={handleComment}
          disabled={sending}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-md text-xs transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
