import { useFieldArray, UseFormReturn } from "react-hook-form";

import { FormValues } from "./schema";

type Props = {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
};

export function PlaylistForm({ form, onSubmit }: Props) {
  const { fields, append } = useFieldArray({
    control: form.control,
    name: "videos",
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <label>
        Name
        <input {...form.register("name")} />
      </label>

      {form.formState.errors.name && <p>{form.formState.errors.name.message}</p>}

      <label>
        Videos
        <ul className="flex flex-col gap-6">
          {fields.map((video, index) => (
            <li key={video.id}>
              <label>
                URL
                <input {...form.register(`videos.${index}.url`)} />
              </label>

              {form.formState.errors.videos?.[index]?.url && (
                <p>{form.formState.errors.videos[index].url.message}</p>
              )}

              <label>
                Sort order
                <input {...form.register(`videos.${index}.sortOrder`)} />
              </label>

              {form.formState.errors.videos?.[index]?.sortOrder && (
                <p>{form.formState.errors.videos[index].sortOrder.message}</p>
              )}
            </li>
          ))}
        </ul>
      </label>

      <button
        type="button"
        onClick={() => append({ url: "", sortOrder: fields.length.toString() })}
      >
        Add video
      </button>

      <button type="submit">Save</button>

      <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
    </form>
  );
}
