import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { RouterOutput, trpc } from "~utils/trpc";

const schema = z.object({
  rawUrl: z.string().trim().url(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  videoData: RouterOutput["getPlaylistVideos"][number];
};

export function VideoForm({ videoData }: Props) {
  const updateVideo = trpc.updateVideo.useMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rawUrl: videoData.rawUrl,
    },
  });

  const onBlur = async () => {
    const values = form.getValues();

    await updateVideo.mutateAsync({
      id: videoData.id,
      rawUrl: values.rawUrl,
    });
  };

  return (
    <form className="flex gap-6 border-amber-500 border">
      <div>
        <label className="flex gap-2">
          URL
          <input {...form.register("rawUrl")} disabled={updateVideo.isPending} onBlur={onBlur} />
        </label>

        {form.formState.errors.rawUrl && <p>{form.formState.errors.rawUrl.message}</p>}
      </div>
    </form>
  );
}
