
export enum DisposalType {
  HAZARD = 'HAZARD',
  COMPOST = 'COMPOST',
  RECYCLE = 'RECYCLE',
  TRASH = 'TRASH'
}

export type Language = 'en' | 'ur' | 'ar';

export interface ClassificationResult {
  type: DisposalType;
  confidence: number;
  englishExplanation: string;
  urduExplanation: string;
  arabicExplanation: string;
  itemName: string;
}

export interface ClassificationConfig {
  color: string;
  bgColor: string;
  icon: string;
  shadowColor: string;
}
