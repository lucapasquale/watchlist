import axios from "axios";

import { config } from "../../config.js";

const client = axios.create({
  baseURL: "https://api.twitch.tv/helix",
  headers: { "Client-ID": config.twitch.clientID },
});

// TODO: Only authenticate when token expires
client.interceptors.request.use(async (req) => {
  const { data: authData } = await axios.post("https://id.twitch.tv/oauth2/token", null, {
    params: {
      grant_type: "client_credentials",
      client_id: config.twitch.clientID,
      client_secret: config.twitch.clientSecret,
    },
  });

  req.headers.Authorization = `Bearer ${authData.access_token}`;
  return req;
});

type Clip = {
  id: string;
  url: string;
  embed_url: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  video_id: string;
  game_id: string;
  language: string;
  title: string;
  view_count: number;
  created_at: Date;
  thumbnail_url: string;
  duration: number;
  vod_offset: number;
  is_featured: boolean;
};

export async function getClip(clipID: string) {
  const { data } = await client.get("/clips", {
    params: { id: clipID },
  });

  return data.data[0] as Clip;
}
