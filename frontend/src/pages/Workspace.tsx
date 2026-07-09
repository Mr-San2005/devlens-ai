import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getProjects, createProject } from "../services/project.service";

export default function Workspace() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (workspaceId) loadProjects();
  }, [workspaceId]);

  const loadProjects = async () => {
    try {
      const data = await getProjects(workspaceId!);
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      await createProject(name, description, workspaceId!);
      setName("");
      setDescription("");
      setShowModal(false);
      loadProjects();
    } finally {
      setCreating(false);
    }
  };

  const statusColors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-orange-500", "bg-pink-500"];

  return (
    <MainLayout title="Projects">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="text-slate-400 text-sm mt-1">
            Select a project to open the board
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span>+</span> New Project
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6 animate-pulse h-36" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">◫</div>
          <p className="text-slate-400 text-lg">No projects yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <div
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg ${statusColors[i % statusColors.length]} flex items-center justify-center text-white font-bold text-lg`}
                >
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-600 group-hover:text-blue-400 transition-colors text-lg">
                  →
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg">{project.name}</h3>
              {project.description && (
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                  {project.description}
                </p>
              )}
              {project.github?.repo && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <span>⎇</span>
                  <span>{project.github.owner}/{project.github.repo}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-5">New Project</h3>
            <input
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 mb-3"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 mb-5 resize-none"
              placeholder="Description (optional)"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white border border-slate-700 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !name.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
