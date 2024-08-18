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
  // const createVideo = trpc.createVideo.useMutation();
  // const updateVideo = trpc.updateVideo.useMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, prepend } = useFieldArray({
    control: form.control,
    name: "videos",
    // keyName: "key",
  });

  const onBlur = async (index: number) => {
    console.log("onBlur", index);
    // const value = form.getValues().videos[index];
    // if (!value) {
    //   return;
    // }

    // if (!value.id) {
    //   const inserted = await createVideo.mutateAsync({
    //     playlistID,
    //     rawUrl: value.rawUrl,
    //   });

    //   form.setValue(`videos.${index}.id`, inserted.id);
    //   return;
    // }

    // await updateVideo.mutateAsync({
    //   id: value.id,
    //   rawUrl: value.rawUrl,
    // });
  };

  return (
    <form>
      {/* <ol className="flex flex-col gap-8">
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
              </label>

              {form.formState.errors.videos?.[index]?.rawUrl && (
                <p>{form.formState.errors.videos[index].message}</p>
              )}
            </div>
          </li>
        ))}
      </ol> */}

      <button onClick={() => prepend({ rawUrl: "" })}>Add video</button>

      <pre className="w-10">{JSON.stringify(form.watch(), null, 2)}</pre>
    </form>
  );
}
