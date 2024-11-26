const GoogleGenerativeAI = require("@google/generative-ai").GoogleGenerativeAI;
const fs = require("fs");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const systemInstruction = fs.readFileSync(__dirname + "/geminiinstructions.txt", 'utf8');

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // 15 RPM LIMIT FOR FREE TIER
  systemInstruction: systemInstruction,
});

// todo whenever someone asks about jit

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2000,
  responseMimeType: "text/plain",
};

module.exports = {
  geminiGenerate: async function (prompt) {
    if (!model)
      return "model unavailable... probably due to lack of api key... contact developer...";
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    try {
      const result = await chatSession.sendMessage(prompt);
      return result.response.text().substring(0,2001); // discord 2k chars
    } catch (err) {
      console.error(err);
      return "error has occurred. jitbot is sick.";
    }
  },
};
