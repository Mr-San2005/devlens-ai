import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getTasks } from "../services/task.service";
import { getProjectById, updateProject } from "../services/project.service";
import {
  getDeveloperBrief,
  chatWithProject,
  getProjectHealth,
  getOnboardingGuide,
} from "../services/ai.service";
import KanbanColumn from "../components/KanbanColumn";
import CreateTaskModal from "../components/CreateTaskModal";

type Tab = "board" | "brief" | "chat" | "health" | "onboarding";

function AiPanel({ content, loading }: { content: string; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">DevLens AI is thinking...</p>
      </div>
    );
  }
  if (!content) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
        {content}
      </pre>
    </div>
  );
}

function HealthDashboard({ data, loading }: { data: any; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Analyzing project health...</p>
      </div>
    );
  }
  if (!data) return null;

  const stats = [
    { label: "Progress", value: `${data.progressPercent}%`, color: "text-blue-400" },
    { label: "Completed", value: data.completedTasks, color: "text-emerald-400" },
    { label: "In Progress", value: data.inProgressTasks, color: "text-yellow-400" },
    { label: "Pending", value: data.pendingTasks, color: "text-slate-400" },
    { label: "Open Issues", value: data.openIssues, color: "text-red-400" },
    { label: "Open PRs", value: data.openPullRequests, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Overall Progress</span>
          <span className="text-sm font-medium text-blue-400">{data.progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${data.progressPercent}%` }}
          />
        </div>
      </div>

      {data.recentCommits?.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Recent Commits</h3>
          <ul className="space-y-2">
            {data.recentCommits.map((msg: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="text-slate-600 mt-0.5">⎇</span>
                <span className="line-clamp-1">{msg}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.summary && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <span className="text-blue-400">◈</span> AI Health Summary
          </h3>
          <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
            {data.summary}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function Project() {
  const { projectId } = useParams();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("board");
  const [showModal, setShowModal] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [githubOwner, setGithubOwner] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [savingGitHub, setSavingGitHub] = useState(false);

  // AI states
  const [brief, setBrief] = useState("");
  const [briefLoading, setBriefLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [health, setHealth] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [onboarding, setOnboarding] = useState("");
  const [onboardingLoading, setOnboardingLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadTasks();
    }
  }, [projectId]);

  const loadProject = async () => {
    const data = await getProjectById(projectId!);
    setProject(data);
  };

  const loadTasks = async () => {
    const data = await getTasks(projectId!);
    setTasks(data);
  };

  const hasGitHub = project?.github?.owner && project?.github?.repo;

  const handleTabChange = async (tab: Tab) => {
    setActiveTab(tab);
    if (!hasGitHub) return;

    if (tab === "brief" && !brief) {
      setBriefLoading(true);
      try {
        const result = await getDeveloperBrief(projectId!);
        setBrief(result);
      } finally {
        setBriefLoading(false);
      }
    }
    if (tab === "health" && !health) {
      setHealthLoading(true);
      try {
        const result = await getProjectHealth(projectId!);
        setHealth(result);
      } finally {
        setHealthLoading(false);
      }
    }
    if (tab === "onboarding" && !onboarding) {
      setOnboardingLoading(true);
      try {
        const result = await getOnboardingGuide(projectId!);
        setOnboarding(result);
      } finally {
        setOnboardingLoading(false);
      }
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const question = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: question }]);
    setChatLoading(true);
    try {
      const answer = await chatWithProject(projectId!, question);
      setChatMessages((prev) => [...prev, { role: "ai", text: answer }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSaveGitHub = async () => {
    if (!githubOwner.trim() || !githubRepo.trim()) return;
    setSavingGitHub(true);
    try {
      await updateProject(projectId!, {
        github: { owner: githubOwner.trim(), repo: githubRepo.trim() },
      });
      await loadProject();
      setShowGitHubModal(false);
    } finally {
      setSavingGitHub(false);
    }
  };

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const progressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "board", label: "Board", icon: "⊞" },
    { id: "brief", label: "Developer Brief", icon: "◈" },
    { id: "chat", label: "AI Chat", icon: "⬡" },
    { id: "health", label: "Health", icon: "◉" },
    { id: "onboarding", label: "Onboarding", icon: "⊕" },
  ];

  const NoGitHub = () => (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="text-4xl">⎇</div>
      <p className="text-slate-300 font-medium">GitHub not connected</p>
      <p className="text-slate-500 text-sm">Connect a GitHub repository to use AI features</p>
      <button
        onClick={() => setShowGitHubModal(true)}
        className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Connect GitHub
      </button>
    </div>
  );

  return (
    <MainLayout title={project?.name || "Project"}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{project?.name || "Loading..."}</h2>
          {project?.description && (
            <p className="text-slate-400 text-sm mt-1">{project.description}</p>
          )}
          {hasGitHub && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
              <span>⎇</span>
              <span>{project.github.owner}/{project.github.repo}</span>
              <button
                onClick={() => {
                  setGithubOwner(project.github.owner);
                  setGithubRepo(project.github.repo);
                  setShowGitHubModal(true);
                }}
                className="ml-1 text-slate-600 hover:text-slate-400 transition-colors"
              >
                (edit)
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!hasGitHub && (
            <button
              onClick={() => setShowGitHubModal(true)}
              className="border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <span>⎇</span> Connect GitHub
            </button>
          )}
          {activeTab === "board" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <span>+</span> New Task
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-800/50 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "board" && (
        <div className="grid grid-cols-3 gap-5">
          <KanbanColumn title="TODO" tasks={todoTasks} onTaskUpdated={loadTasks} />
          <KanbanColumn title="IN PROGRESS" tasks={progressTasks} onTaskUpdated={loadTasks} />
          <KanbanColumn title="DONE" tasks={doneTasks} onTaskUpdated={loadTasks} />
        </div>
      )}

      {activeTab === "brief" && (
        hasGitHub ? (
          <div>
            {!brief && !briefLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-slate-400">Generate your developer brief</p>
                <button
                  onClick={() => handleTabChange("brief")}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Generate Brief
                </button>
              </div>
            )}
            <AiPanel content={brief} loading={briefLoading} />
            {brief && !briefLoading && (
              <button
                onClick={() => { setBrief(""); handleTabChange("brief"); }}
                className="mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                ↺ Regenerate
              </button>
            )}
          </div>
        ) : <NoGitHub />
      )}

      {activeTab === "chat" && (
        hasGitHub ? (
          <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
              {chatMessages.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">⬡</div>
                  <p className="text-slate-400 font-medium">Ask anything about this project</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {[
                      "Explain this project",
                      "What changed recently?",
                      "Which tasks are blocked?",
                      "Who is working on what?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => { setChatInput(q); }}
                        className="bg-slate-800 border border-slate-700 hover:border-blue-500 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 border border-slate-700 text-slate-300"
                    }`}
                  >
                    {msg.role === "ai" && (
                      <div className="flex items-center gap-1.5 mb-2 text-blue-400 text-xs font-medium">
                        <span>◈</span> DevLens AI
                      </div>
                    )}
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed">{msg.text}</pre>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <input
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                placeholder="Ask about this project..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
              />
              <button
                onClick={handleChat}
                disabled={chatLoading || !chatInput.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        ) : <NoGitHub />
      )}

      {activeTab === "health" && (
        hasGitHub ? (
          <div>
            {!health && !healthLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-slate-400">Analyze your project health</p>
                <button
                  onClick={() => handleTabChange("health")}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Analyze Health
                </button>
              </div>
            )}
            <HealthDashboard data={health} loading={healthLoading} />
            {health && !healthLoading && (
              <button
                onClick={() => { setHealth(null); handleTabChange("health"); }}
                className="mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                ↺ Refresh
              </button>
            )}
          </div>
        ) : <NoGitHub />
      )}

      {activeTab === "onboarding" && (
        hasGitHub ? (
          <div>
            {!onboarding && !onboardingLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-slate-400">Generate onboarding guide for new developers</p>
                <button
                  onClick={() => handleTabChange("onboarding")}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Generate Guide
                </button>
              </div>
            )}
            <AiPanel content={onboarding} loading={onboardingLoading} />
            {onboarding && !onboardingLoading && (
              <button
                onClick={() => { setOnboarding(""); handleTabChange("onboarding"); }}
                className="mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                ↺ Regenerate
              </button>
            )}
          </div>
        ) : <NoGitHub />
      )}

      {/* Create Task Modal */}
      {showModal && projectId && (
        <CreateTaskModal
          projectId={projectId}
          onClose={() => setShowModal(false)}
          onTaskCreated={loadTasks}
        />
      )}

      {/* GitHub Modal */}
      {showGitHubModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Connect GitHub Repository</h3>
            <p className="text-slate-400 text-sm mb-5">
              Link a GitHub repo to enable AI features
            </p>
            <div className="space-y-3">
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                placeholder="GitHub owner (e.g. octocat)"
                value={githubOwner}
                onChange={(e) => setGithubOwner(e.target.value)}
              />
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                placeholder="Repository name (e.g. my-project)"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowGitHubModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white border border-slate-700 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGitHub}
                disabled={savingGitHub || !githubOwner.trim() || !githubRepo.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {savingGitHub ? "Saving..." : "Connect"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
