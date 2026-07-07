import api from "../api/axios";

export const getWorkspaces = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/workspaces", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};