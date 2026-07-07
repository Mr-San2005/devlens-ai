import api from "../api/axios";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getTasks = async (projectId: string) => {
  const response = await api.get(
    `/tasks/project/${projectId}`,
    getAuthHeader()
  );

  return response.data;
};

export const createTask = async (
  title: string,
  description: string,
  projectId: string
) => {
  const response = await api.post(
    "/tasks",
    {
      title,
      description,
      projectId,
    },
    getAuthHeader()
  );

  return response.data;
};

export const updateTaskStatus = async (
  taskId: string,
  status: string
) => {
  const response = await api.patch(
    `/tasks/${taskId}`,
    {
      status,
    },
    getAuthHeader()
  );

  return response.data;
};

export const assignTask = async (
  taskId: string,
  assignedTo: string
) => {

  const response = await api.patch(
    `/tasks/${taskId}/assign`,
    {
      assignedTo,
    },
    getAuthHeader()
  );

  return response.data;

};