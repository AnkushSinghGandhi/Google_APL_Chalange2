import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
let genAI = null;
let model = null;

export const initializeGemini = (apiKey) => {
    if (!apiKey) return;
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

const primaryKey = import.meta.env.VITE_GEMINI_API_KEY_PRIMARY;
const fallbackKey = import.meta.env.VITE_GEMINI_API_KEY_FALLBACK;
const envKey = primaryKey || fallbackKey;

if (envKey) {
    initializeGemini(envKey);
}

const cleanAndParseJSON = (text) => {
    try {
        let cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const firstBrace = cleanText.indexOf('{');
        const firstBracket = cleanText.indexOf('[');
        const lastBrace = cleanText.lastIndexOf('}');
        const lastBracket = cleanText.lastIndexOf(']');

        let start = -1;
        let end = -1;

        if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
            start = firstBrace;
            end = lastBrace;
        } else if (firstBracket !== -1) {
            start = firstBracket;
            end = lastBracket;
        }

        if (start !== -1 && end !== -1) {
            cleanText = cleanText.substring(start, end + 1);
        }

        return JSON.parse(cleanText);
    } catch (e) {
        throw new Error("⚠️ PARSE ERROR: AI returned invalid format. Try again.");
    }
};

const classifyError = (error) => {
    const msg = error.message || error.toString();
    if (msg.includes('429')) return `⏳ RATE LIMIT: Free tier quota exceeded.`;
    if (msg.includes('403')) return '🔒 ACCESS DENIED: Check API permissions.';
    if (msg.includes('401')) return '🔑 INVALID KEY: Check your API key.';
    if (msg.includes('CORS') || msg.includes('network')) return '🌐 NETWORK ERROR: Check connection.';
    return `❌ ERROR: ${msg.substring(0, 100)}`;
};

const getContextHash = (context) => {
    if (!context) return "general";
    let hash = 0;
    for (let i = 0; i < context.length; i++) {
        const char = context.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return Math.abs(hash).toString(16);
};

const getUserContext = (profile) => {
    if (!profile) return "";
    const parts = [];
    if (profile.occupation) parts.push(`Occupation: ${profile.occupation}`);
    if (profile.goal) parts.push(`Goal: ${profile.goal}`);
    if (profile.skills) parts.push(`Skills: ${profile.skills}`);

    if (parts.length === 0) return "";
    return `\nUser Context:\n${parts.map(p => `- ${p}`).join("\n")}\nTailor the technical depth and examples to this user's level and interests.`;
};

export const generateQuiz = async (context, userProfile) => {
    if (!model) throw new Error("Gemini API Key not set. Go to Settings to add your key.");
    const cacheKey = `ai_cache_quiz_${getContextHash(context)}_${getContextHash(JSON.stringify(userProfile))}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    const prompt = `You are an adaptive learning quiz generator. Generate 5 MCQ questions to test the user's understanding of the given topic.

${getUserContext(userProfile)}

Content/Topic:
${context.substring(0, 10000)}

IMPORTANT: Adapt the difficulty based on the user's level mentioned in the content. For beginners, use foundational questions. For advanced users, ask deeper conceptual questions.

Return ONLY valid JSON with this structure:
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}`;

    try {
        const result = await model.generateContent(prompt);
        const data = cleanAndParseJSON(result.response.text());
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
    } catch (error) {
        throw new Error(classifyError(error));
    }
};

export const generateRoadmap = async (context, userProfile) => {
    if (!model) throw new Error("Gemini API Key not set. Go to Settings to add your key.");
    const cacheKey = `ai_cache_roadmap_${getContextHash(context)}_${getContextHash(JSON.stringify(userProfile))}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    const prompt = `You are an adaptive learning path designer. Create a structured learning roadmap for the given topic.

${getUserContext(userProfile)}

Topic/Context:
${context.substring(0, 10000)}

IMPORTANT: Adapt the roadmap complexity based on the user's level. For beginners, start with fundamentals. For advanced users, focus on deeper concepts.

Return ONLY valid JSON array:
[
  { "id": 1, "step": "Step Title", "details": "What to learn and how" }
]

Include 6-8 progressive steps.`;

    try {
        const result = await model.generateContent(prompt);
        const data = cleanAndParseJSON(result.response.text());
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
    } catch (error) {
        throw new Error(classifyError(error));
    }
};

export const generatePathfinder = async (context, userProfile) => {
    if (!model) throw new Error("Gemini API Key not set. Go to Settings to add your key.");
    const cacheKey = `ai_cache_pathfinder_${getContextHash(context)}_${getContextHash(JSON.stringify(userProfile))}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    const prompt = `You are an intelligent learning advisor. Based on the current topic, suggest what to learn next and project ideas to practice.

${getUserContext(userProfile)}

Current Topic/Context:
${context.substring(0, 10000)}

Return ONLY valid JSON:
{
  "nextTopic": {
    "title": "Recommended next topic",
    "description": "Why this topic follows naturally and what it covers"
  },
  "projects": [
    {
      "title": "Project Name",
      "description": "Brief description of the project",
      "difficulty": "Beginner|Intermediate|Advanced"
    }
  ]
}

Include 3 project ideas of varying difficulty.`;

    try {
        const result = await model.generateContent(prompt);
        const data = cleanAndParseJSON(result.response.text());
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
    } catch (error) {
        throw new Error(classifyError(error));
    }
};

export const generateTutorStream = async (history, message, context, userProfile, onChunk) => {
    if (!model) throw new Error("Gemini API Key not set. Go to Settings to add your key.");

    const chatHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    const systemInstruction = `You are LearnWise AI — an expert adaptive learning tutor powered by Google Gemini. Your goal is to help users learn new concepts effectively.

${getUserContext(userProfile)}

Current Learning Context:
${context || "General learning assistance"}

GUIDELINES:
- Adapt explanations to the user's level (beginner/intermediate/advanced as indicated)
- Use clear markdown formatting with headers, bullet points, and code blocks
- Include practical examples and analogies
- Break complex concepts into digestible chunks
- Encourage the user with positive reinforcement
- If the user seems confused, simplify your explanation
- Suggest related topics to explore when relevant
- Be concise but thorough`;

    try {
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "I'm LearnWise AI, ready to help you learn! What would you like to explore?" }] },
                ...chatHistory
            ]
        });

        const result = await chat.sendMessageStream(message);
        for await (const chunk of result.stream) {
            onChunk(chunk.text());
        }
    } catch (error) {
        throw new Error(classifyError(error));
    }
};
