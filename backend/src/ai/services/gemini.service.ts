import axios from "axios";

export const generateResponse = async (context: any) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3.3-8b-instruct:free",
      messages: [
        {
          role: "system",
          content:
            "You are DevLens AI, an expert software engineering assistant.",
        },
        {
          role: "user",
          content: `
Project Context:

${JSON.stringify(context, null, 2)}

Generate a developer briefing with:

- Welcome Back
- Recent Commits
- Completed Tasks
- Pending Tasks
- Recent Discussions
- Recommended Next Step
          `,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
};