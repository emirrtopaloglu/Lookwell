import { fal } from "@fal-ai/client";

export const falClient = fal.config({
  credentials: process.env.EXPO_PUBLIC_FAL_API_KEY,
});
