import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateInterviewQuestions(role, level, questions) {
  const prompt = `
Generate ${questions} interview questions for a ${level} ${role}.

Rules:
- Only return the questions.
- Number them.
- Do not include answers.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.choices[0].message.content;
}