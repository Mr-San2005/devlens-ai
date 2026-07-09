import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "⊞" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-xl">◈</span>
            <span className="font-bold text-lg tracking-tight">DevLens AI</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Understand your project</p>
        </div>

        <nav className="flex flex-col p-3 gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-colors flex items-center gap-3"
          >
            <span>⎋</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-white">
            {title || "Dashboard"}
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            <span className="text-sm text-slate-400">Connected</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
