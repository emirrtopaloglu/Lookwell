/**
 * Central design system tokens for Lookwell.
 * Exposes palette, semantic colors, typography, spacing, radii, and elevation presets
 * for both light and dark appearance modes.
 */

import { Platform } from 'react-native';

export const Palette = Object.freeze({
  white: '#FFFFFF',
  black: '#030712',
  slate25: '#F9FAFB',
  slate50: '#F3F4F6',
  slate100: '#E5E7EB',
  slate200: '#D1D5DB',
  slate300: '#9CA3AF',
  slate400: '#6B7280',
  slate500: '#4B5563',
  slate600: '#374151',
  slate700: '#1F2937',
  slate800: '#111827',
  slate900: '#0B1120',
  teal50: '#F0FDFA',
  teal100: '#CCFBF1',
  teal200: '#99F6E4',
  teal300: '#5EEAD4',
  teal400: '#2DD4BF',
  teal500: '#14B8A6',
  teal600: '#0D9488',
  teal700: '#0F766E',
  teal800: '#115E59',
  teal900: '#134E4A',
  amber200: '#FDE68A',
  amber500: '#F59E0B',
  rose200: '#FECACA',
  rose500: '#EF4444',
  sky200: '#BAE6FD',
  sky500: '#0EA5E9',
  overlayLight: 'rgba(243, 244, 246, 0.75)',
  overlayDark: 'rgba(15, 23, 42, 0.72)',
} as const);

export type PaletteToken = keyof typeof Palette;

interface ThemeColorTokens {
  text: string;
  textSecondary: string;
  textMuted: string;
  textOnAccent: string;
  background: string;
  backgroundAlt: string;
  backgroundElevated: string;
  backgroundSunken: string;
  surface: string;
  tint: string;
  icon: string;
  iconMuted: string;
  iconOnAccent: string;
  border: string;
  borderStrong: string;
  divider: string;
  accent: string;
  accentHover: string;
  accentActive: string;
  accentSoft: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  info: string;
  infoSoft: string;
  highlight: string;
  tabIconDefault: string;
  tabIconSelected: string;
  scrim: string;
  overlay: string;
  skeletonBase: string;
  skeletonHighlight: string;
}

const lightColors: ThemeColorTokens = {
  text: Palette.slate700,
  textSecondary: Palette.slate500,
  textMuted: Palette.slate400,
  textOnAccent: Palette.white,
  background: Palette.slate25,
  backgroundAlt: Palette.white,
  backgroundElevated: Palette.white,
  backgroundSunken: Palette.slate50,
  surface: Palette.white,
  tint: Palette.teal500,
  icon: Palette.slate400,
  iconMuted: Palette.slate300,
  iconOnAccent: Palette.white,
  border: Palette.slate100,
  borderStrong: Palette.slate200,
  divider: 'rgba(15, 23, 42, 0.08)',
  accent: Palette.teal500,
  accentHover: Palette.teal600,
  accentActive: Palette.teal700,
  accentSoft: Palette.teal100,
  success: Palette.teal500,
  successSoft: 'rgba(20, 184, 166, 0.14)',
  warning: Palette.amber500,
  warningSoft: 'rgba(245, 158, 11, 0.16)',
  danger: Palette.rose500,
  dangerSoft: 'rgba(239, 68, 68, 0.16)',
  info: Palette.sky500,
  infoSoft: 'rgba(14, 165, 233, 0.16)',
  highlight: 'rgba(20, 184, 166, 0.1)',
  tabIconDefault: Palette.slate300,
  tabIconSelected: Palette.teal500,
  scrim: Palette.overlayDark,
  overlay: Palette.overlayLight,
  skeletonBase: Palette.slate50,
  skeletonHighlight: Palette.slate25,
};

const darkColors: ThemeColorTokens = {
  text: Palette.slate25,
  textSecondary: 'rgba(226, 232, 240, 0.72)',
  textMuted: 'rgba(148, 163, 184, 0.6)',
  textOnAccent: Palette.white,
  background: Palette.slate900,
  backgroundAlt: Palette.slate800,
  backgroundElevated: '#1E293B',
  backgroundSunken: '#0F172A',
  surface: '#14202E',
  tint: Palette.teal400,
  icon: 'rgba(226, 232, 240, 0.75)',
  iconMuted: 'rgba(148, 163, 184, 0.48)',
  iconOnAccent: Palette.white,
  border: 'rgba(148, 163, 184, 0.24)',
  borderStrong: 'rgba(148, 163, 184, 0.38)',
  divider: 'rgba(20, 31, 40, 0.7)',
  accent: Palette.teal400,
  accentHover: Palette.teal300,
  accentActive: Palette.teal200,
  accentSoft: 'rgba(45, 212, 191, 0.16)',
  success: Palette.teal300,
  successSoft: 'rgba(45, 212, 191, 0.18)',
  warning: Palette.amber200,
  warningSoft: 'rgba(253, 230, 138, 0.2)',
  danger: Palette.rose200,
  dangerSoft: 'rgba(254, 202, 202, 0.22)',
  info: Palette.sky200,
  infoSoft: 'rgba(186, 230, 253, 0.2)',
  highlight: 'rgba(13, 148, 136, 0.24)',
  tabIconDefault: 'rgba(148, 163, 184, 0.65)',
  tabIconSelected: Palette.teal300,
  scrim: 'rgba(2, 6, 23, 0.78)',
  overlay: 'rgba(15, 23, 42, 0.76)',
  skeletonBase: '#1F2937',
  skeletonHighlight: '#273549',
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
} as const;

export type ThemeName = keyof typeof Colors;
export type ThemeColorToken = keyof ThemeColorTokens;

export const Spacing = Object.freeze({
  none: 0,
  '3xs': 2,
  '2xs': 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
} as const);

export type SpacingToken = keyof typeof Spacing;

export const Radii = Object.freeze({
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
  full: 9999,
} as const);

export type RadiusToken = keyof typeof Radii;

interface Elevation {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
  elevation: number;
}

export const Elevations = {
  level0: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  level1: {
    shadowColor: 'rgba(15, 23, 42, 0.18)',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  level2: {
    shadowColor: 'rgba(15, 23, 42, 0.2)',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  level3: {
    shadowColor: 'rgba(8, 12, 22, 0.32)',
    shadowOpacity: 0.32,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
  },
} as const satisfies Record<string, Elevation>;

export type ElevationToken = keyof typeof Elevations;

interface FontFamilies {
  sans: string;
  sansMedium: string;
  sansBold: string;
  serif: string;
  rounded: string;
  mono: string;
}

const fontFamilies =
  Platform.select<FontFamilies>({
    ios: {
      sans: 'System',
      sansMedium: 'System',
      sansBold: 'System',
      serif: 'Times New Roman',
      rounded: 'System',
      mono: 'Menlo',
    },
    android: {
      sans: 'Roboto',
      sansMedium: 'Roboto-Medium',
      sansBold: 'Roboto-Bold',
      serif: 'serif',
      rounded: 'Rubik',
      mono: 'monospace',
    },
    web: {
      sans: "Inter, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      sansMedium: "Inter, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      sansBold: "Inter, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      serif: "Georgia, 'Times New Roman', serif",
      rounded: "'Nunito', 'Segoe UI Rounded', 'SF Pro Rounded', sans-serif",
      mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    default: {
      sans: 'system-ui',
      sansMedium: 'system-ui',
      sansBold: 'system-ui',
      serif: 'serif',
      rounded: 'system-ui',
      mono: 'monospace',
    },
  }) ?? {
    sans: 'system-ui',
    sansMedium: 'system-ui',
    sansBold: 'system-ui',
    serif: 'serif',
    rounded: 'system-ui',
    mono: 'monospace',
  };

export const Fonts = fontFamilies;

export const Typography = Object.freeze({
  display: {
    fontFamily: fontFamilies.sansBold,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.4,
    fontWeight: '700' as const,
  },
  title1: {
    fontFamily: fontFamilies.sansBold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.2,
    fontWeight: '700' as const,
  },
  title2: {
    fontFamily: fontFamilies.sansBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.15,
    fontWeight: '700' as const,
  },
  title3: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.1,
    fontWeight: '600' as const,
  },
  body: {
    fontFamily: fontFamilies.sans,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.05,
    fontWeight: '400' as const,
  },
  bodyStrong: {
    fontFamily: fontFamilies.sansBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.05,
    fontWeight: '600' as const,
  },
  bodySmall: {
    fontFamily: fontFamilies.sans,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.02,
    fontWeight: '400' as const,
  },
  caption: {
    fontFamily: fontFamilies.sans,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    fontWeight: '500' as const,
  },
  button: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '600' as const,
  },
  label: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '600' as const,
  },
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: -0.05,
    fontWeight: '500' as const,
  },
} as const);

export type TypographyToken = keyof typeof Typography;

export const Theme = Object.freeze({
  light: {
    colors: Colors.light,
    spacing: Spacing,
    radii: Radii,
    typography: Typography,
    elevations: Elevations,
  },
  dark: {
    colors: Colors.dark,
    spacing: Spacing,
    radii: Radii,
    typography: Typography,
    elevations: Elevations,
  },
});
