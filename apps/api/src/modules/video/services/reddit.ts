import axios from "axios";

type Post = {
  title: string;
  thumbnail: string;
  media: {
    reddit_video: {
      fallback_url: string;
      height: string;
      width: string;
      scrubber_media_url: string;
      dash_url: string;
      duration: string;
      hls_url: string;
      is_gif: string;
      transcoding_status: string;
    };
  };
};

export async function getPost(url: string): Promise<Post | null> {
  const { data } = await axios.get(url + ".json");

  return data?.[0]?.data?.children?.[0]?.data ?? null;
}
