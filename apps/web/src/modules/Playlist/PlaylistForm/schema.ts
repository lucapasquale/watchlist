import { z } from "zod";

export const schema = z.object({
  name: z.string().trim().min(1),
  videos: z.array(
    z.object({
      url: z.string().trim().url(),
      sortOrder: z.string(),
    }),
  ),
});

export type FormValues = z.infer<typeof schema>;
