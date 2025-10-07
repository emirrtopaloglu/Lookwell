import { fal } from "@fal-ai/client";

export const falClient = fal.config({
  credentials: process.env.FAL_API_KEY,
});
