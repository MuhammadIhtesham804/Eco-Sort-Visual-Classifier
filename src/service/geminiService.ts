import { ClassificationResult, DisposalType } from '../types';
import { GoogleGenerativeAI } from '@google/genai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const CLASSIFICATION_PROMPT = `Analyze this waste item image and classify it accurately for proper disposal.

IMPORTANT RULES:
1. Carefully examine the image and identify the item type
2. HAZARD items: Batteries, electronics, chemicals, broken glass, sharp objects, medical waste, light bulbs
3. COMPOST items: Food scraps, leaves, grass, paper products, organic waste
4. RECYCLE items: Plastic bottles, aluminum cans, cardboard, glass bottles, metal, newspapers
5. TRASH items: Plastic bags, candy wrappers, used tissues, non-recyclable plastics, mixed waste

YOU MUST ALWAYS RESPOND WITH THIS EXACT JSON FORMAT (no markdown, no code blocks):
{
  "type": "HAZARD|COMPOST|RECYCLE|TRASH",
  "confidence": 0.95,
  "itemName": "Name of the item",
  "englishExplanation": "Why this should go to [CATEGORY].",
  "urduExplanation": "یہ [CATEGORY] میں کیوں جانی چاہیے۔",
  "arabicExplanation": "لماذا يجب أن يذهب هذا إلى [CATEGORY]."
}

Respond ONLY with the JSON object, nothing else.`;

export async function classifyImage(base64: string): Promise<ClassificationResult> {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'PLACEHOLDER_API_KEY') {
      throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in .env.local');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Extract base64 data (remove data:image/... prefix)
    const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');

    const response = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      },
      CLASSIFICATION_PROMPT
    ]);

    const responseText = response.response.text();

    // Parse the response - it should be pure JSON
    let classification: any;
    try {
      // Extract JSON if there's extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        classification = JSON.parse(jsonMatch[0]);
      } else {
        classification = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse API response:', responseText);
      throw new Error('Invalid API response format');
    }

    // Validate required fields
    if (!classification.type || !['HAZARD', 'COMPOST', 'RECYCLE', 'TRASH'].includes(classification.type)) {
      throw new Error('Invalid disposal type in response');
    }

    // Ensure confidence is a number between 0 and 1
    let confidence = parseFloat(classification.confidence);
    if (isNaN(confidence) || confidence < 0 || confidence > 1) {
      confidence = 0.85; // Default confidence if parsing fails
    }

    // Build the result
    const result: ClassificationResult = {
      type: classification.type as DisposalType,
      confidence: Math.round(confidence * 100) / 100, // Round to 2 decimal places
      englishExplanation: classification.englishExplanation || `This item should be disposed in the ${classification.type} bin.`,
      urduExplanation: classification.urduExplanation || `یہ چیز ${classification.type} میں پھینکی جانی چاہیے۔`,
      arabicExplanation: classification.arabicExplanation || `يجب التخلص من هذا العنصر في ${classification.type}.`,
      itemName: classification.itemName || 'Unknown Item'
    };

    return result;
  } catch (error) {
    console.error('Image classification error:', error);
    throw error;
  }
}