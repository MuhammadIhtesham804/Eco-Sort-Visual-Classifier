import { ClassificationResult, DisposalType } from '../types';

export async function classifyImage(_base64: string): Promise<ClassificationResult> {
  // TODO: Integrate actual Gemini API call here
  return {
    type: DisposalType.TRASH,
    confidence: 0.95,
    englishExplanation: "This item should be disposed in the trash bin.",
    urduExplanation: "یہ چیز کوڑے دان میں پھینکی جانی چاہیے۔",
    arabicExplanation: "يجب التخلص من هذا العنصر في سلة القمامة.",
    itemName: "Test Item"
  };
}