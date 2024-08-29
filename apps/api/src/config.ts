import "dotenv/config";
import { z } from "zod";

export const config = parseEnvVars();

function parseEnvVars() {
  const schema = z.object({
    port: z.coerce.number().positive().default(3000),
    host: z.string().min(1).default("0.0.0.0"),

    database: z.object({
      host: z.string().min(1),
      database: z.string().min(1),
      user: z.string().min(1),
      password: z.string().min(1),
    }),

    youtube: z.object({
      apiKey: z.string().min(1),
    }),
    twitch: z.object({
      clientID: z.string().min(1),
      clientSecret: z.string().min(1),
    }),
  });

  const { error, data } = schema.safeParse({
    port: process.env.PORT,
    host: process.env.HOST,

    database: {
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
    },

    youtube: {
      apiKey: process.env.YOUTUBE_API_KEY,
    },
    twitch: {
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
    },
  });

  if (error || !data) {
    throw new Error("Invalid ENV var config", {
      cause: error.errors,
    });
  }

  return data;
}
