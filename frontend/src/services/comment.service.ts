import api from "../api/axios";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getComments = async (taskId: string) => {
  const response = await api.get(
    `/comments/task/${taskId}`,
    getAuthHeader()
  );

  return response.data;
};

export const createComment = async (
  message: string,
  task: string
) => {
  const response = await api.post(
    "/comments",
    {
      message,
      task,
    },
    getAuthHeader()
  );

  return response.data;
};