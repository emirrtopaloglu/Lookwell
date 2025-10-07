import AsyncStorage from '@react-native-async-storage/async-storage';

export type RecentPhoto = {
  id: string; // unique id
  url: string; // result image url
  createdAt: number; // epoch ms
  requestId?: string;
};

const STORAGE_KEY = 'lookwell.recentPhotos.v1';
const MAX_ITEMS = 20;

export async function getRecentPhotos(): Promise<RecentPhoto[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentPhoto).sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export async function addRecentPhoto(item: { url: string; requestId?: string }): Promise<RecentPhoto[]> {
  const current = await getRecentPhotos();
  const now = Date.now();
  const entry: RecentPhoto = {
    id: `${now}-${Math.random().toString(36).slice(2)}`,
    url: item.url,
    createdAt: now,
    requestId: item.requestId,
  };
  const next = [entry, ...dedupeByUrl(current, item.url)].slice(0, MAX_ITEMS);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function clearRecentPhotos(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

function isRecentPhoto(value: unknown): value is RecentPhoto {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.url === 'string' &&
    typeof v.createdAt === 'number'
  );
}

function dedupeByUrl(items: RecentPhoto[], url: string): RecentPhoto[] {
  return items.filter((p) => p.url !== url);
}


