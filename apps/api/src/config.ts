import "dotenv/config";
import { z } from "zod";

export const config = parseEnvVars();

function parseEnvVars() {
  const schema = z.object({
    host: z.string().min(1).default("0.0.0.0"),
    port: z.coerce.number().positive().default(3000),

    adminToken: z.string().min(1),
    clientUrl: z.string().url().default("http://localhost:5173"),
    serverUrl: z.string().url().default("http://localhost:3000"),

    database: z.object({
      host: z.string().min(1),
      database: z.string().min(1),
      user: z.string().min(1),
      password: z.string().min(1),
    }),

    auth: z.object({
      jwtSecret: z.string().min(1),
      google: z.object({
        clientID: z.string().min(1),
        clientSecret: z.string().min(1),
      }),
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

    adminToken: process.env.ADMIN_TOKEN,
    clientUrl: process.env.CLIENT_URL,
    serverUrl: process.env.SERVER_URL,

    database: {
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
    },

    auth: {
      jwtSecret: process.env.JWT_SECRET,
      google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
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
    throw new Error("Invalid ENV var config " + error.toString());
  }

  return data;
}
