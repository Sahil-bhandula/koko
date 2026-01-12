import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", 
});

const SYSTEM_PROMPT = `
You are a veterinary assistant chatbot.
Answer ONLY veterinary and pet health related questions.
Allowed topics: pet care, vaccinations, diet, nutrition, common illnesses, preventive care.
If the question is NOT related to animals or pets, politely say you cannot help.
Keep answers short, clear, and helpful.
`;

export const generateVetReply = async (userMessage) => {
  try {
    const prompt = `${SYSTEM_PROMPT}\n\nUser question:\n${userMessage}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my veterinary database. Please try again later.";
  }
};