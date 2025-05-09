import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputFormItem } from "@ui/components/form/input-form-item.js";
import { Button } from "@ui/components/ui/button.js";
import { DialogClose, DialogFooter } from "@ui/components/ui/dialog.js";
import { Form } from "@ui/components/ui/form.js";

import { CreatePlaylistDocument, UserViewDocument } from "~common/graphql-types.js";
import { Route } from "~routes/index.js";

const schema = z.object({
  name: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

export function CreateNew() {
  const navigate = Route.useNavigate();

  const [createPlaylist, { loading }] = useMutation(CreatePlaylistDocument, {
    refetchQueries: [UserViewDocument],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const { data } = await createPlaylist({
      variables: { input: { name: values.name } },
    });

    if (!data) {
      return;
    }

    form.reset({ name: "" });
    navigate({ to: "/p/$playlistID", params: { playlistID: data.createPlaylist.id } });
  };

  return (
    <>
      <Form {...form}>
        <form
          id="create-playlist"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center gap-4"
        >
          <InputFormItem
            autoComplete="off"
            control={form.control}
            name="name"
            label="Name"
            placeholder="My playlist"
          />
        </form>
      </Form>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>

        <Button type="submit" form="create-playlist" disabled={!form.formState.isValid || loading}>
          Add
        </Button>
      </DialogFooter>
    </>
  );
}
