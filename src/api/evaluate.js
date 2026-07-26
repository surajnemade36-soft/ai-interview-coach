const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function evaluateInterview(questions, answers) {
  const prompt = `
You are an expert software interviewer.

Evaluate the interview based on the questions and answers.

Questions:
${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Answers:
${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Return ONLY valid JSON.

{
  "overallScore": 90,
  "technical": 92,
  "communication": 85,
  "confidence": 80,
  "feedback": [
    "Point 1",
    "Point 2",
    "Point 3"
  ]
}
`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Groq API Error");
  }

  let content = data.choices[0].message.content;

// Remove ```json and ```
content = content.replace(/```json/g, "");
content = content.replace(/```/g, "");
content = content.trim();

return content;
}