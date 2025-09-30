/**
 * Type definition for a saved look/style in the user's collection
 */
export interface CollectionItem {
  id: string;
  imageUri: string;
  prompt?: string;
  createdAt: string; // ISO date format
}

