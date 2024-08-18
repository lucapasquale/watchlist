import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link } from "~components/Link";
import { VideoForm } from "~modules/Video/VideoForm";
import { Route } from "~routes/playlists/$playlistID/index.lazy";
import { trpc } from "~utils/trpc";

import { type FormValues, schema } from "./PlaylistForm/schema";
import { PlaylistForm } from "./PlaylistForm";

export function Page() {
  const { playlistID } = Route.useParams();

  const playlist = trpc.getPlaylist.useQuery(Number(playlistID));
  const playlistVideos = trpc.getPlaylistVideos.useQuery(Number(playlistID));

  const updatePlaylist = trpc.updatePlaylist.useMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    if (!playlist.data || !playlistVideos.data) {
      return undefined;
    }

    form.reset({ name: playlist.data.name });
  }, [form, playlist.data, playlistVideos.data]);

  const onSubmit = async (values: FormValues) => {
    await updatePlaylist.mutateAsync({
      id: Number(playlistID),
      name: values.name,
    });

    playlist.refetch();
  };

  return (
    <>
      <section className="flex flex-col items-center px-8 gap-40">
        {playlistVideos.data?.length ? (
          <Link to={`/playlists/${playlistID}/${playlistVideos.data[0].id}`}>First video</Link>
        ) : null}

        <PlaylistForm form={form} onSubmit={onSubmit} />

        <article>
          <h2>Videos</h2>

          <ol>
            {playlistVideos.data?.map((video) => (
              <li key={video.id}>
                <VideoForm videoData={video} />
              </li>
            ))}
          </ol>
        </article>
      </section>
    </>
  );
}
