import api from "../api/axios";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getWorkspaces = async () => {
  const response = await api.get("/workspaces", getAuthHeader());
  return response.data;
};

export const createWorkspace = async (name: string, description: string) => {
  const response = await api.post(
    "/workspaces",
    { name, description },
    getAuthHeader()
  );
  return response.data;
};
