/**
 * Weekly style themes for the Style Spotlight feature.
 * Each day of the week showcases a different curated fashion theme.
 */

export interface StyleTheme {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  imageUri: string;
  gradientColors: readonly [string, string, string];
}

export const STYLE_THEMES: readonly StyleTheme[] = [
  {
    id: 'tokyo-streetwear',
    title: 'Tokyo Streetwear',
    subtitle: "Today's Theme: Urban Edge",
    prompt: 'Harajuku street fashion with layered clothing and bold accessories',
    imageUri: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600',
    gradientColors: ['rgba(236, 72, 153, 0.08)', 'rgba(251, 146, 60, 0.04)', 'transparent'],
  },
  {
    id: 'office-chic',
    title: 'Office Chic',
    subtitle: "Today's Theme: Professional Elegance",
    prompt: 'Modern office attire with sophisticated tailoring and clean lines',
    imageUri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
    gradientColors: ['rgba(59, 130, 246, 0.08)', 'rgba(147, 197, 253, 0.04)', 'transparent'],
  },
  {
    id: 'minimalist-aesthetic',
    title: 'Minimalist Aesthetic',
    subtitle: "Today's Theme: Less is More",
    prompt: 'Minimalist fashion with neutral tones and simple silhouettes',
    imageUri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600',
    gradientColors: ['rgba(148, 163, 184, 0.08)', 'rgba(203, 213, 225, 0.04)', 'transparent'],
  },
  {
    id: 'vintage-revival',
    title: 'Vintage Revival',
    subtitle: "Today's Theme: 90s Nostalgia",
    prompt: 'Retro 90s fashion with oversized denim and vintage accessories',
    imageUri: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600',
    gradientColors: ['rgba(168, 85, 247, 0.08)', 'rgba(192, 132, 252, 0.04)', 'transparent'],
  },
  {
    id: 'athletic-luxury',
    title: 'Athletic Luxury',
    subtitle: "Today's Theme: Sport Meets Style",
    prompt: 'Athleisure fashion combining comfort with high-end design',
    imageUri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
    gradientColors: ['rgba(34, 197, 94, 0.08)', 'rgba(134, 239, 172, 0.04)', 'transparent'],
  },
  {
    id: 'bohemian-spirit',
    title: 'Bohemian Spirit',
    subtitle: "Today's Theme: Free & Flowing",
    prompt: 'Bohemian style with flowing fabrics and earthy tones',
    imageUri: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600',
    gradientColors: ['rgba(217, 119, 6, 0.08)', 'rgba(251, 191, 36, 0.04)', 'transparent'],
  },
  {
    id: 'evening-glamour',
    title: 'Evening Glamour',
    subtitle: "Today's Theme: Night Out",
    prompt: 'Elegant evening wear with sophisticated details and luxurious fabrics',
    imageUri: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600',
    gradientColors: ['rgba(139, 92, 246, 0.08)', 'rgba(196, 181, 253, 0.04)', 'transparent'],
  },
] as const;

/**
 * Get the style theme for today based on the day of the week.
 * Monday = 0, Sunday = 6
 */
export function getTodaysTheme(): StyleTheme {
  const dayOfWeek = new Date().getDay();
  // Map Sunday (0) to 6, Monday (1) to 0, etc.
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return STYLE_THEMES[adjustedDay % STYLE_THEMES.length];
}

