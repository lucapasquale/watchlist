import React from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { Button } from "@ui/components/ui/button";
import { Form } from "@ui/components/ui/form";

import { RouterOutput, trpc } from "~utils/trpc";

const schema = z.object({
  rawURL: z.string().min(1).url(),
});
export type FormValues = z.infer<typeof schema>;

type Props = {
  playlistID: number;
  onAdd: (video: NonNullable<RouterOutput["getPlaylistVideos"]>[number]) => void;
};

export function AddVideo({ playlistID, onAdd }: Props) {
  const createVideo = trpc.createVideo.useMutation();

  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    const inserted = await createVideo.mutateAsync({
      playlistID,
      rawUrl: values.rawURL,
    });

    setOpen(false);
    onAdd(inserted);
  };

  return (
    <>
      {!open && (
        <Button variant="default" onClick={() => setOpen(true)}>
          Add <Plus className="ml-1 w-4 h-4" />
        </Button>
      )}

      {open && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-center gap-4"
          >
            <InputFormItem
              control={form.control}
              name="rawURL"
              label="Add new URL from video"
              placeholder="URL"
              className="w-full"
            />

            <div className="flex gap-2">
              <Button variant="outline" type="reset" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
