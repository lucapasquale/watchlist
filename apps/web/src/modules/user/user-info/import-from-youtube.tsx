import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormItem } from "@ui/components/form/input-form-item.js";
import { Button } from "@ui/components/ui/button.js";
import { DialogClose, DialogFooter } from "@ui/components/ui/dialog.js";
import { Form } from "@ui/components/ui/form.js";

import { CreatePlaylistFromYoutubeDocument, UserViewDocument } from "~common/graphql-types.js";
import { Route } from "~routes/index.lazy.js";

const schema = z.object({
  playlistURL: z.string().url(),
});
type FormValues = z.infer<typeof schema>;

export function ImportFromYoutube() {
  const navigate = Route.useNavigate();

  const [createPlaylist, { loading }] = useMutation(CreatePlaylistFromYoutubeDocument, {
    refetchQueries: [UserViewDocument],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { playlistURL: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const { data } = await createPlaylist({
      variables: { url: values.playlistURL },
    });
    if (!data) {
      return;
    }

    form.reset({ playlistURL: "" });
    navigate({ to: "/p/$playlistID", params: { playlistID: data.createPlaylistFromYoutube.id } });
  };

  return (
    <Form {...form}>
      <form
        id="playlist-from-youtube"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-4"
      >
        <InputFormItem
          control={form.control}
          name="playlistURL"
          label="Playlist URL"
          placeholder="https://www.youtube.com/playlist?list=PL2gDVp_0vZOQjqMex201dYpUiu1mcGX96"
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            type="submit"
            form="playlist-from-youtube"
            disabled={!form.formState.isValid || loading}
          >
            Add
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
