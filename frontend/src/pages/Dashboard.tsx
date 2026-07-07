import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import { getWorkspaces } from "../services/workspace.service";

export default function Dashboard() {

  const [workspaces, setWorkspaces] = useState<any[]>([]);

  useEffect(() => {

    loadWorkspaces();

  }, []);

  const loadWorkspaces = async () => {

    try {

      const data = await getWorkspaces();

      setWorkspaces(data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <MainLayout>

      <h2 className="text-3xl font-bold mb-6">
        My Workspaces
      </h2>

      <div className="grid grid-cols-3 gap-6">

        {workspaces.map((workspace) => (

  <div
    key={workspace._id}
    className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-xl transition"
    onClick={() =>
      window.location.href = `/workspace/${workspace._id}`
    }
  >

    <h3 className="text-xl font-semibold">

      {workspace.name}

    </h3>

    <p className="mt-2 text-gray-600">

      {workspace.description}

    </p>

    <p className="mt-4 text-sm text-gray-500">

      Owner: {workspace.owner.name}

    </p>

  </div>

))} 

      </div>

    </MainLayout>

  );

}