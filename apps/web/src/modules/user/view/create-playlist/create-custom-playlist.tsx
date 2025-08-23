import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InputFormItem } from "@ui/components/form/input-form-item.js";
import { Button } from "@ui/components/ui/button.js";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog.js";
import { Form } from "@ui/components/ui/form.js";

import { CreatePlaylistDocument, UserPlaylistsDocument } from "~common/graphql-types.js";
import { Route } from "~routes/index.js";

const schema = z.object({
  name: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

export function CreateCustomPlaylist() {
  const navigate = Route.useNavigate();
  const [open, setOpen] = React.useState(false);

  const [createPlaylist, { loading }] = useMutation(CreatePlaylistDocument, {
    refetchQueries: [UserPlaylistsDocument],
    awaitRefetchQueries: true,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const { data } = await createPlaylist({
      variables: { input: values },
    });

    if (!data) {
      return;
    }

    form.reset();
    navigate({ to: "/playlist/$playlistID", params: { playlistID: data.createPlaylist.id } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="self-end">
          Create playlist
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create playlist</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="create-playlist"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center gap-4"
          >
            <InputFormItem
              required
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

          <Button
            type="submit"
            form="create-playlist"
            disabled={!form.formState.isValid}
            loading={loading}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
