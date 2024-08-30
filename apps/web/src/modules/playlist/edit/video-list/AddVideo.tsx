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
type FormValues = z.infer<typeof schema>;

type Props = {
  playlistID: number;
  onAdd: (video: NonNullable<RouterOutput["getPlaylistItems"]>[number]) => void;
};

export function AddVideo({ playlistID, onAdd }: Props) {
  const createVideo = trpc.createPlaylistItem.useMutation();

  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onCancel = () => {
    setOpen(false);
    form.reset({ rawURL: "" });
  };

  const onSubmit = async (values: FormValues) => {
    const inserted = await createVideo.mutateAsync({
      playlistID,
      rawUrl: values.rawURL,
    });

    form.reset({ rawURL: "" });
    onAdd(inserted);
    setOpen(false);
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
              <Button variant="outline" type="reset" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={createVideo.isPending}>
                Add
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
