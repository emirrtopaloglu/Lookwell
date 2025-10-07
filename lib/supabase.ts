import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
// Avoid deprecated legacy API usage; fetch the local URI directly as a Blob

type Env = {
  EXPO_PUBLIC_SUPABASE_URL?: string;
  EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
};

const env = (Constants.expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {}) as Env;

const SUPABASE_URL = env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY. Ensure they are set in app config (expo.extra) or env.');
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export type SignedUrlResult = {
  signedUrl: string;
  path: string;
  expiresInSeconds: number;
};

export async function uploadTempImageAndGetSignedUrl(params: {
  bucket: string;
  localUri: string; // e.g., file://... from ImagePicker or FileSystem
  pathPrefix?: string; // logical folder inside the bucket, defaults to 'temp'
  expiresInSeconds?: number; // signed URL TTL
}): Promise<SignedUrlResult> {
  const { bucket, localUri, pathPrefix = 'temp', expiresInSeconds = 60 * 15 } = params;

  const fileExt = guessExtensionFromUri(localUri);
  const objectPath = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}${fileExt}`;

  const contentType = guessContentTypeFromExt(fileExt);
  // Read local file URI directly as Blob (Expo SDK 54+ supports fetch on file:// URIs)
  const response = await fetch(localUri);
  if (!response.ok) {
    throw new Error(`Failed to read file at URI: ${localUri} (status ${response.status})`);
  }
  const arrayBuffer = await response.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(objectPath, arrayBuffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(objectPath, expiresInSeconds);

  if (signError || !signed) {
    throw signError ?? new Error('Failed to create signed URL');
  }

  return { signedUrl: signed.signedUrl, path: objectPath, expiresInSeconds };
}

export async function removeTempObject(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

function guessExtensionFromUri(uri: string): string {
  const match = /\.(jpg|jpeg|png|webp|gif|heic|heif)$/i.exec(uri);
  return match ? `.${match[1].toLowerCase()}` : '.jpg';
}

function guessContentTypeFromExt(ext: string): string {
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.heic': 'image/heic',
    '.heif': 'image/heif',
  };
  return map[ext] ?? 'application/octet-stream';
}


