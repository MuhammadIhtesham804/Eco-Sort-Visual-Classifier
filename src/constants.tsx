
import { DisposalType, ClassificationConfig } from './types';

export const CLASSIFICATION_UI_CONFIG: Record<DisposalType, ClassificationConfig> = {
  [DisposalType.HAZARD]: {
    color: 'bg-red-600',
    bgColor: 'bg-red-50',
    icon: '⚠️',
    shadowColor: 'shadow-red-500/50'
  },
  [DisposalType.COMPOST]: {
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    icon: '🍃',
    shadowColor: 'shadow-yellow-500/50'
  },
  [DisposalType.RECYCLE]: {
    color: 'bg-green-600',
    bgColor: 'bg-green-50',
    icon: '♻️',
    shadowColor: 'shadow-green-500/50'
  },
  [DisposalType.TRASH]: {
    color: 'bg-gray-600',
    bgColor: 'bg-gray-50',
    icon: '🗑️',
    shadowColor: 'shadow-gray-500/50'
  }
};
