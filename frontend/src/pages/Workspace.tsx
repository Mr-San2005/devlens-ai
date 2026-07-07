import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { getProjects } from "../services/project.service";

export default function Workspace() {

  const navigate = useNavigate();

  const { workspaceId } = useParams();

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {

    if (workspaceId) {

      loadProjects();

    }

  }, [workspaceId]);

  const loadProjects = async () => {

    const data = await getProjects(workspaceId!);

    setProjects(data);

  };

  return (

    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">
        Projects
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {projects.map((project) => (

          <div
            key={project._id}
            onClick={() => navigate(`/project/${project._id}`)}
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-xl transition"
          >

            <h2 className="text-xl font-semibold">
              {project.name}
            </h2>

            <p className="mt-2 text-gray-600">
              {project.description}
            </p>

          </div>

        ))}

      </div>

    </MainLayout>

  );

}