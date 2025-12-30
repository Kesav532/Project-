
import { GoogleGenAI } from "@google/genai";
import { Complaint } from "../types";

export const GeminiService = {
  suggestCategory: async (description: string): Promise<string> => {
    // Always use named parameter for apiKey and initialize instance right before call.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      // Use 'gemini-3-flash-preview' for basic text tasks like categorization.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following complaint description and categorize it into ONE of these categories: Roads, Sanitation, Electricity, Water, Safety, or General. Return ONLY the category name. Description: "${description}"`,
      });
      // Use .text property directly.
      return response.text ? response.text.trim() : "General";
    } catch (e) {
      console.error("Gemini Error:", e);
      return "General";
    }
  },

  generateAdminReport: async (complaints: Complaint[]): Promise<string> => {
    // Always use named parameter for apiKey and initialize instance right before call.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Summarize data to send to LLM to save tokens
    const summaryData = complaints.map(c => ({
      category: c.category,
      status: c.status,
      title: c.title,
      date: c.createdAt.split('T')[0]
    }));

    const prompt = `
      You are an AI assistant for a City Administration Dashboard.
      Analyze the following complaint data and provide a professional "Daily Executive Briefing".
      
      Data: ${JSON.stringify(summaryData)}
      
      Structure the response as HTML (do not use markdown code blocks like \`\`\`html) with these sections:
      1. <h3>Key Trends</h3>: What is the most common issue?
      2. <h3>Critical Attention</h3>: Any urgent patterns?
      3. <h3>Sentiment Summary</h3>: General tone of complaints.
      4. <h3>Recommendation</h3>: One actionable advice for the admin.
      
      Keep it concise and professional.
    `;

    try {
      // Use 'gemini-3-flash-preview' for basic text tasks like summarization/analysis.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      // Use .text property directly.
      return response.text || "Could not generate report.";
    } catch (e) {
      console.error("Gemini Error:", e);
      return "Could not generate report at this time.";
    }
  }
};
