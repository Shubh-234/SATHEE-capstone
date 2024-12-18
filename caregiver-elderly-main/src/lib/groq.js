import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const reqGroqAI = async (content, emotion) => {
  let prompt = content;
  if (emotion === "Sad") {
    prompt += `
     give some suggestions to help uplift my mood like:
      - Watch a good movie
      - Listen to some cheerful songs
      - Try exercising to boost your energy
      Also say "you can click the above buttons to get personalized recommendations for movies, songs, or exercises!"
    `;
  }
  const res = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-8b-8192",
  });
  return res;
};
