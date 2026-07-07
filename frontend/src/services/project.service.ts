import api from "../api/axios";

export const getProjects = async (workspaceId: string) => {
  const token = localStorage.getItem("token");

  const response = await api.get(`/projects/${workspaceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};