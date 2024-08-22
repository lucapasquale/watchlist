import { DeepPartial, useFieldArray, useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/ui/button";
import { Form } from "@ui/components/ui/form";

import { VideoFormItem } from "./VideoFormItem";

const schema = z.object({
  videos: z.array(
    z.object({
      id: z.number().positive().optional(),
      rawUrl: z.string().trim(),
    }),
  ),
});
export type FormValues = z.infer<typeof schema>;

type Props = {
  playlistID: number;
  defaultValues?: DeepPartial<FormValues>;
};

export function VideoForm({ playlistID, defaultValues }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "videos",
    keyName: "key",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => console.log("onSubmit"))}
        className="flex flex-col gap-8"
      >
        <ol className="flex flex-col gap-8">
          {fields.map((field, index) => (
            <VideoFormItem
              key={field.key}
              index={index}
              playlistID={playlistID}
              onDelete={() => remove(index)}
            />
          ))}
        </ol>

        <Button variant="default" onClick={() => append({ rawUrl: "" })}>
          Add <Plus className="ml-1 w-4 h-4" />
        </Button>
      </form>
    </Form>
  );
}
