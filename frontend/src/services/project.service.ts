import api from "../api/axios";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getProjects = async (workspaceId: string) => {
  const response = await api.get(
    `/projects/workspace/${workspaceId}`,
    getAuthHeader()
  );
  return response.data;
};

export const getProjectById = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}`, getAuthHeader());
  return response.data;
};

export const createProject = async (
  name: string,
  description: string,
  workspaceId: string
) => {
  const response = await api.post(
    "/projects",
    { name, description, workspaceId },
    getAuthHeader()
  );
  return response.data;
};

export const updateProject = async (projectId: string, data: object) => {
  const response = await api.patch(
    `/projects/${projectId}`,
    data,
    getAuthHeader()
  );
  return response.data;
};
