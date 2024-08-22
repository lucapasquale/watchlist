import { DeepPartial, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "~utils/trpc";

const schema = z.object({
  videos: z.array(
    z.object({
      id: z.number().positive().optional(),
      rawUrl: z.string().trim().url(),
    }),
  ),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  playlistID: number;
  defaultValues?: DeepPartial<FormValues>;
};

export function VideoForm({ playlistID, defaultValues }: Props) {
  const createVideo = trpc.createVideo.useMutation();
  const updateVideo = trpc.updateVideo.useMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    reValidateMode: "onBlur",
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "videos",
    keyName: "key",
  });

  const onBlur = async (index: number) => {
    const video = form.getValues().videos[index];
    if (!video) {
      return;
    }

    form.clearErrors(`videos.${index}.rawUrl`);

    if (!video.id) {
      const inserted = await createVideo.mutateAsync({
        playlistID,
        rawUrl: video.rawUrl,
      });

      form.setValue(`videos.${index}.id`, inserted.id);
      return;
    }

    await updateVideo.mutateAsync({
      id: video.id,
      rawUrl: video.rawUrl,
    });
  };

  const deleteVideo = async (index: number) => {
    const video = form.getValues().videos[index];
    if (!video) {
      return;
    }

    if (video.id) {
      // TODO: delete video
    }

    remove(index);
  };

  return (
    <form onSubmit={form.handleSubmit(() => console.log("onSubmit"))}>
      <ol className="flex flex-col gap-8">
        {fields.map((field, index) => (
          <li key={field.key} className="flex gap-6 border-amber-500 border">
            <label className="flex gap-2">ID {form.getValues(`videos.${index}.id`)}</label>

            <div>
              <label className="flex gap-2">
                URL
                <input
                  {...form.register(`videos.${index}.rawUrl`)}
                  disabled={updateVideo.isPending}
                  onBlur={() => onBlur(index)}
                />
                <button onClick={() => deleteVideo(index)}>X</button>
              </label>

              {form.formState.errors.videos?.[index]?.rawUrl && (
                <p>{form.formState.errors.videos[index].rawUrl.message}</p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <button onClick={() => append({ rawUrl: "" })}>Add video</button>
    </form>
  );
}
