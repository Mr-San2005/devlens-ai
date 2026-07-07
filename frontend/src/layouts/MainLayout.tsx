import type { ReactNode } from "react"; 
import { useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}

      <aside className="w-64 bg-gray-900 text-white">

        <div className="text-2xl font-bold p-6 border-b border-gray-700">
          SprintHub
        </div>

        <nav className="flex flex-col p-4 gap-2">

          <button className="text-left hover:bg-gray-700 p-3 rounded">
            Dashboard
          </button>

          <button className="text-left hover:bg-gray-700 p-3 rounded">
            Workspaces
          </button>

          <button className="text-left hover:bg-gray-700 p-3 rounded">
            Projects
          </button>

          <button className="text-left hover:bg-gray-700 p-3 rounded">
            Tasks
          </button>

          <button className="text-left hover:bg-gray-700 p-3 rounded">
            AI Assistant
          </button>

        </nav>

      </aside>

      {/* Main */}

      <div className="flex-1">

        <header className="bg-white shadow px-8 py-4 flex justify-between items-center">

          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>

        </header>

        <main className="p-8">

          {children}

        </main>

      </div>

    </div>
  );
}