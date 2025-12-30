import { ClassificationResult, DisposalType } from '../types';
import { GoogleGenerativeAI } from '@google/genai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Helper function to detect MIME type from base64
function detectMimeType(base64: string): string {
  if (base64.includes('data:image/png')) return 'image/png';
  if (base64.includes('data:image/jpeg')) return 'image/jpeg';
  if (base64.includes('data:image/jpg')) return 'image/jpeg';
  if (base64.includes('data:image/gif')) return 'image/gif';
  if (base64.includes('data:image/webp')) return 'image/webp';
  return 'image/jpeg'; // Default fallback
}

// Improved classification prompt with detailed instructions
const CLASSIFICATION_PROMPT = `You are an expert waste classification AI. Analyze this image carefully and classify the waste item into EXACTLY ONE category.

CLASSIFICATION RULES:
====================

⚠️ HAZARD Category (Dangerous/Toxic Items):
- Batteries (all types), electronic waste, broken light bulbs
- Chemical containers, medications, sharp glass shards
- Medical waste, syringes, needles
- Oil/paint containers, hazardous materials
- Broken thermometers, fluorescent tubes

🍃 COMPOST Category (Organic/Biodegradable):
- Food waste: fruits, vegetables, meat, bones, leftovers
- Leaves, grass clippings, plant matter, branches
- Paper products: cardboard, newspaper (no plastic coating)
- Tea bags, coffee grounds, eggshells
- Wood chips, sawdust, natural fibers

♻️ RECYCLE Category (Recyclable Materials):
- Plastic bottles and containers (numbered 1-7)
- Aluminum and steel cans, metal items
- Glass bottles and jars (clear/colored)
- Cardboard and paper boxes
- Newspapers, magazines, paper bags
- Metal lids, aluminum foil

🗑️ TRASH Category (Non-Recyclable/Mixed):
- Plastic bags, plastic film, plastic wrap
- Candy wrappers, food wrappers
- Used tissues, napkins, paper towels
- Non-recyclable plastics, styrofoam
- Mixed contaminated waste
- Broken ceramics/pottery
- Rubber items, leather, fabric

CONFIDENCE GUIDELINES:
- 0.9-1.0: Absolutely certain (clear item)
- 0.7-0.89: Very confident (minor doubt)
- 0.5-0.69: Confident (some ambiguity)
- Below 0.5: Low confidence (unclear/mixed items)

YOU MUST RESPOND WITH VALID JSON ONLY (no markdown, no code blocks, no extra text):

{
  "type": "HAZARD|COMPOST|RECYCLE|TRASH",
  "confidence": 0.95,
  "itemName": "specific item name",
  "englishExplanation": "Clear reason why this item belongs in this category.",
  "urduExplanation": "واضح وجہ کہ یہ چیز اس زمرے میں کیوں آتی ہے۔",
  "arabicExplanation": "السبب الواضح لوضع هذا العنصر في هذه الفئة."
}

CRITICAL: Response must be ONLY the JSON object.`;

export async function classifyImage(base64: string, retryCount = 0): Promise<ClassificationResult> {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'PLACEHOLDER_API_KEY') {
      throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in .env.local');
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent results
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 500
      }
    });

    // Extract base64 data and detect MIME type
    const mimeType = detectMimeType(base64);
    const base64Data = base64.replace(/^data:image\/[a-z+;=]+,/, '');

    const response = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType as any,
          data: base64Data
        }
      },
      CLASSIFICATION_PROMPT
    ]);

    const responseText = response.response.text().trim();

    // Parse the response - it should be pure JSON
    let classification: any;
    try {
      // More robust JSON extraction
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const jsonStr = jsonMatch[0];
      classification = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse API response:', responseText);
      
      // Retry once if parsing fails
      if (retryCount < 1) {
        console.log('Retrying classification...');
        return classifyImage(base64, retryCount + 1);
      }
      
      throw new Error('Invalid API response format');
    }

    // Validate and normalize the response
    if (!classification.type) {
      throw new Error('Missing disposal type in response');
    }

    const validTypes = ['HAZARD', 'COMPOST', 'RECYCLE', 'TRASH'];
    const normalizedType = String(classification.type).toUpperCase().trim();
    
    if (!validTypes.includes(normalizedType)) {
      throw new Error(`Invalid disposal type: ${classification.type}`);
    }

    // Parse and validate confidence
    let confidence = parseFloat(classification.confidence);
    if (isNaN(confidence) || confidence < 0) {
      confidence = 0.8;
    } else if (confidence > 1) {
      confidence = confidence / 100; // Handle percentage values (95 -> 0.95)
    }
    confidence = Math.min(1, Math.max(0, confidence)); // Clamp between 0-1

    // Validate item name
    const itemName = String(classification.itemName || 'Unknown Item').trim();
    if (!itemName || itemName.length === 0) {
      throw new Error('Missing item name in response');
    }

    // Build the result with fallback explanations
    const generateFallbackExplanation = (category: string, item: string): { en: string; ur: string; ar: string } => {
      const categoryMap = {
        'HAZARD': { en: 'dangerous and requires special handling', ur: 'خطرناک ہے اور خصوصی حفاظت کی ضرورت ہے', ar: 'خطير ويتطلب معالجة خاصة' },
        'COMPOST': { en: 'organic and biodegradable', ur: 'نامیاتی اور قابل تحلل ہے', ar: 'عضوي وقابل للتحلل' },
        'RECYCLE': { en: 'made from recyclable material', ur: 'قابل تدوير مواد سے بنی ہے', ar: 'مصنوع من مادة قابلة للتدوير' },
        'TRASH': { en: 'non-recyclable and should be thrown away', ur: 'غیر قابل تدوير ہے اور پھینکی جانی چاہیے', ar: 'غير قابل للتدوير ويجب التخلص منه' }
      };
      return categoryMap[category as keyof typeof categoryMap] || categoryMap['TRASH'];
    };

    const fallback = generateFallbackExplanation(normalizedType, itemName);

    const result: ClassificationResult = {
      type: normalizedType as DisposalType,
      confidence: Math.round(confidence * 100) / 100,
      englishExplanation: (classification.englishExplanation || '').trim() || `This ${itemName} is ${fallback.en}.`,
      urduExplanation: (classification.urduExplanation || '').trim() || `یہ ${itemName} ${fallback.ur}.`,
      arabicExplanation: (classification.arabicExplanation || '').trim() || `هذا ${itemName} ${fallback.ar}.`,
      itemName: itemName
    };

    return result;
  } catch (error) {
    console.error('Image classification error:', error);
    throw error;
  }
}