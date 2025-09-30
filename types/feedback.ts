export type FeedbackType = 'positive' | 'negative';

export type NegativeFeedbackReason =
  | 'color-mismatch'
  | 'too-busy'
  | 'not-my-style'
  | 'quality-issues'
  | 'other';

export interface FeedbackItem {
  id: string;
  generatedImageUri: string;
  originalImageUri: string;
  prompt?: string;
  feedbackType: FeedbackType;
  negativeReason?: NegativeFeedbackReason;
  customNote?: string;
  createdAt: string; // ISO date format
}

export const negativeFeedbackOptions = [
  {
    id: 'color-mismatch' as NegativeFeedbackReason,
    label: 'Color Doesn\'t Match',
    icon: 'color-palette-outline' as const,
    description: 'The colors don\'t work well together',
  },
  {
    id: 'too-busy' as NegativeFeedbackReason,
    label: 'Too Busy/Complex',
    icon: 'warning-outline' as const,
    description: 'The style is too complicated',
  },
  {
    id: 'not-my-style' as NegativeFeedbackReason,
    label: 'Not My Style',
    icon: 'close-circle-outline' as const,
    description: 'This doesn\'t match my preferences',
  },
  {
    id: 'quality-issues' as NegativeFeedbackReason,
    label: 'Quality Issues',
    icon: 'alert-circle-outline' as const,
    description: 'The result has visual problems',
  },
  {
    id: 'other' as NegativeFeedbackReason,
    label: 'Other',
    icon: 'ellipsis-horizontal-outline' as const,
    description: 'Something else bothered me',
  },
];

