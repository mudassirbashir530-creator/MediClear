import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected automatically in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string.
 */
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeMedicalReport = async (file: File): Promise<AnalysisResult> => {
  try {
    const base64Data = await fileToGenerativePart(file);

    // Using gemini-3-pro-preview for better reasoning and detailed extraction capabilities
    const modelId = "gemini-3-pro-preview";

    const prompt = `
      You are an empathetic medical assistant named "MediClear".
      Your task is to analyze the image of a medical lab report or prescription provided.
      
      1. Identify the key findings in the report.
      2. Write a "Simple Summary" explaining these findings in very simple English, suitable for a Grade 5 reading level. Avoid complex medical jargon. If the user is healthy/normal, say so clearly.
      3. Write a "Detailed Summary" that provides a more comprehensive explanation, including specific values found and their implications, suitable for an adult user who wants more depth.
      4. Translate the "Simple Summary" into Urdu.
      5. Provide 3-5 general "Next Steps" or health tips related to the context (e.g., "Drink more water", "Reduce sugar", "Get 8 hours of sleep").
      
      If the image is NOT a medical document, politely explain in the summary that you can only analyze medical reports.

      Output STRICT JSON.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { 
              type: Type.STRING,
              description: "A simple grade-5 level summary of the report in English."
            },
            detailedSummary: { 
              type: Type.STRING,
              description: "A comprehensive, slightly technical summary of the report including values."
            },
            urduTranslation: { 
              type: Type.STRING,
              description: "The Urdu translation of the simple summary."
            },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3-5 simple health tips."
            }
          },
          required: ["summary", "detailedSummary", "urduTranslation", "nextSteps"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(text) as AnalysisResult;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};

export const askReportQuestion = async (context: string, question: string): Promise<string> => {
  try {
    // Context is the summary/detailed summary of the report
    const prompt = `
      Context from medical report: "${context}"
      
      User Question: "${question}"
      
      Instructions:
      1. Answer the user's question based on the provided report context.
      2. If the answer is not in the context, use general medical knowledge but provide a disclaimer that you are an AI.
      3. Use a friendly, conversational tone.
      4. IMPORTANT: Answer in a mix of simple English and Urdu (Roman Urdu). For example: "Yes, aap rice kha sakte hain, but moderation mein."
      5. Keep the answer concise (2-4 sentences).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { text: prompt }
    });

    return response.text || "Sorry, I couldn't provide an answer at this moment.";
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting right now. Please try again.";
  }
};