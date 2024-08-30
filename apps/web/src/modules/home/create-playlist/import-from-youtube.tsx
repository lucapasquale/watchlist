import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { Button } from "@ui/components/ui/button";
import { Form } from "@ui/components/ui/form";

import { Route } from "~routes/index.lazy";
import { trpc } from "~utils/trpc";

const schema = z.object({
  playlistURL: z.string().url(),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  onCancel: () => void;
};

export function ImportFromYoutube({ onCancel }: Props) {
  const navigate = Route.useNavigate();

  const createPlaylistFromYoutube = trpc.createPlaylistFromYoutube.useMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onCancelClick = () => {
    form.reset({ playlistURL: "" });
    onCancel();
  };

  const onSubmit = async (values: FormValues) => {
    const inserted = await createPlaylistFromYoutube.mutateAsync({
      url: values.playlistURL,
    });

    form.reset({ playlistURL: "" });
    navigate({ to: "/p/$playlistID", params: { playlistID: inserted.id.toString() } });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-4"
      >
        <InputFormItem
          control={form.control}
          name="playlistURL"
          label="URL"
          placeholder="https://www.youtube.com/playlist?list=PL2gDVp_0vZOQjqMex201dYpUiu1mcGX96"
        />

        <div className="flex gap-2">
          <Button variant="outline" type="reset" onClick={onCancelClick}>
            Cancel
          </Button>
          <Button type="submit" disabled={createPlaylistFromYoutube.isPending}>
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
}
