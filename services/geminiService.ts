
import { GoogleGenAI, Type } from "@google/genai";
import { ClassificationResult, DisposalType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const CLASSIFICATION_PROMPT = `
You are an expert waste classification agent for Eco-Sort. 
Analyze the image and categorize the item strictly using these prioritized rules:

1. SAFETY RULE (HIGHEST PRIORITY): Batteries, electronics, and chemicals are HAZARD (Red).
2. GREASE RULE: If cardboard or paper has food stains or grease (e.g., dirty pizza box), it is COMPOST (Yellow), NOT Recycle.
3. STANDARD RULE: Clean plastic bottles, cans, and clean cardboard are RECYCLE (Green).
4. DEFAULT RULE: If the item is unrecognizable or soft plastic (wrappers), default to TRASH (Grey).

Return a JSON object following the schema provided.
- English explanation: Concise factory-level instruction.
- Urdu explanation: Accurate translation of the applied rule.
- Arabic explanation: Accurate translation of the applied rule.
`;

export async function classifyImage(base64Image: string): Promise<ClassificationResult> {
  const model = 'gemini-3-flash-preview';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: CLASSIFICATION_PROMPT },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              enum: Object.values(DisposalType),
              description: "The classification category.",
            },
            itemName: {
              type: Type.STRING,
              description: "Brief name of the item identified.",
            },
            englishExplanation: {
              type: Type.STRING,
              description: "English sorting instruction.",
            },
            urduExplanation: {
              type: Type.STRING,
              description: "Urdu sorting instruction.",
            },
            arabicExplanation: {
              type: Type.STRING,
              description: "Arabic sorting instruction.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score 0-1.",
            }
          },
          required: ["type", "itemName", "englishExplanation", "urduExplanation", "arabicExplanation", "confidence"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as ClassificationResult;
  } catch (error) {
    console.error("Classification error:", error);
    throw error;
  }
}
