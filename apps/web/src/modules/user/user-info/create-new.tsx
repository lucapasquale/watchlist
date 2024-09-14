import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { Button } from "@ui/components/ui/button";
import { DialogClose, DialogFooter } from "@ui/components/ui/dialog";
import { Form } from "@ui/components/ui/form";

import { CreatePlaylistDocument, UserViewDocument } from "~common/graphql-types";
import { Route } from "~routes/index.lazy";

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
    <Form {...form}>
      <form
        id="create-playlist"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-4"
      >
        <InputFormItem control={form.control} name="name" label="Name" placeholder="My playlist" />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            type="submit"
            form="create-playlist"
            disabled={!form.formState.isValid || loading}
          >
            Add
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
