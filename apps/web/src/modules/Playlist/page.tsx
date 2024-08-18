import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link } from "~components/Link";
import { Route } from "~routes/playlists/$playlistID/index.lazy";
import { trpc } from "~utils/trpc";

import { type FormValues, schema } from "./PlaylistForm/schema";
// import { PlaylistForm } from "./PlaylistForm";

export function Page() {
  const { playlistID } = Route.useParams();

  const playlist = trpc.getPlaylist.useQuery(Number(playlistID));
  const playlistVideos = trpc.getVideos.useQuery(Number(playlistID));

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { videos: [] },
  });

  React.useEffect(() => {
    if (!playlist.data || !playlistVideos.data) {
      return undefined;
    }

    form.reset({
      name: playlist.data.name,
      videos: playlistVideos.data.map((video) => ({
        url: video.url,
        sortOrder: video.sortOrder.toString(),
      })),
    });
  }, [form, playlist.data, playlistVideos.data]);

  return (
    <>
      <section className="flex flex-col items-center px-8">
        <pre>{JSON.stringify(playlist.data, null, 2)}</pre>

        {playlistVideos.data?.length && (
          <Link to={`/playlists/${playlistID}/${playlistVideos.data[0].id}`}>First video</Link>
        )}

        {/* <PlaylistForm form={form} onSubmit={(values) => console.log(values)} /> */}
      </section>
    </>
  );
}
