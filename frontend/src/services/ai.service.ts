import api from "../api/axios";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getDeveloperBrief = async (projectId: string) => {
  const response = await api.post(
    "/ai/developer-brief",
    { projectId },
    getAuthHeader()
  );
  return response.data.brief as string;
};

export const chatWithProject = async (projectId: string, question: string) => {
  const response = await api.post(
    "/ai/chat",
    { projectId, question },
    getAuthHeader()
  );
  return response.data.answer as string;
};

export const getProjectHealth = async (projectId: string) => {
  const response = await api.get(`/ai/health/${projectId}`, getAuthHeader());
  return response.data;
};

export const getOnboardingGuide = async (projectId: string) => {
  const response = await api.get(
    `/ai/onboarding/${projectId}`,
    getAuthHeader()
  );
  return response.data.guide as string;
};
