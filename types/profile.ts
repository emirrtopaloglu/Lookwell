/**
 * User Profile Types
 */

export type Gender = 'male' | 'female' | 'non-binary' | 'prefer not to say';

export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55+';

export type StylePreference =
  | 'streetwear'
  | 'casual'
  | 'business'
  | 'sporty'
  | 'elegant'
  | 'bohemian'
  | 'minimalist'
  | 'vintage';

export interface UserProfile {
  name: string;
  gender: Gender;
  ageRange: AgeRange;
  stylePreferences: StylePreference[];
}

export interface ProfileSetupData {
  displayName: string;
  gender: Gender | null;
  ageRange: AgeRange | null;
  stylePreferences: StylePreference[];
}

