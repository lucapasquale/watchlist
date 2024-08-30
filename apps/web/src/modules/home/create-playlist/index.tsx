import React from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { Button } from "@ui/components/ui/button";
import { Form } from "@ui/components/ui/form";

import { Route } from "~routes/index.lazy";
import { trpc } from "~utils/trpc";

const schema = z.object({
  name: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

export function CreatePlaylist() {
  const navigate = Route.useNavigate();

  const createPlaylist = trpc.createPlaylist.useMutation();

  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onCancel = () => {
    setOpen(false);
    form.reset({ name: "" });
  };

  const onSubmit = async (values: FormValues) => {
    const inserted = await createPlaylist.mutateAsync({
      name: values.name,
    });

    form.reset({ name: "" });
    navigate({ to: "/p/$playlistID", params: { playlistID: inserted.id.toString() } });
    setOpen(false);
  };

  return (
    <>
      {!open && (
        <Button variant="default" onClick={() => setOpen(true)}>
          Add <Plus className="ml-1 size-4" />
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
              name="name"
              label="Name"
              placeholder="My playlist"
            />

            <div className="flex gap-2">
              <Button variant="outline" type="reset" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPlaylist.isPending}>
                Add
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
