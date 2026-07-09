import axios from "axios";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const call = async (systemPrompt: string, userPrompt: string): Promise<string> => {
  const response = await axios.post(
    GROQ_URL,
    {
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.choices[0].message.content;
};

export const generateResponse = (context: any): Promise<string> =>
  call(
    "You are DevLens AI, an expert software engineering assistant. Be concise and structured.",
    `Project Context:\n\n${JSON.stringify(context, null, 2)}\n\nGenerate a developer briefing with:\n- Welcome Back\n- Recent Commits\n- Completed Tasks\n- Pending Tasks\n- Recent Discussions\n- Recommended Next Step`
  );

export const chatWithContext = (context: any, question: string): Promise<string> =>
  call(
    "You are DevLens AI, an expert software engineering assistant embedded in a project management tool. Answer questions about the project using the provided context. Be concise and helpful.",
    `Project Context:\n\n${JSON.stringify(context, null, 2)}\n\nQuestion: ${question}`
  );

export const generateHealthSummary = (context: any): Promise<string> =>
  call(
    "You are DevLens AI. Analyze project health and provide a concise summary with risk assessment.",
    `Project Health Data:\n\n${JSON.stringify(context, null, 2)}\n\nProvide a project health summary covering: overall status, risks, blockers, and recommendations.`
  );

export const generateOnboardingGuide = (context: any): Promise<string> =>
  call(
    "You are DevLens AI. Generate a helpful onboarding guide for a new developer joining this project.",
    `Project Context:\n\n${JSON.stringify(context, null, 2)}\n\nGenerate an onboarding guide covering: project overview, architecture, important modules, recent changes, current blockers, and recommended files to read first.`
  );
