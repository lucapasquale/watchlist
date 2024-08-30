import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { Button } from "@ui/components/ui/button";
import { Form } from "@ui/components/ui/form";

import { Route } from "~routes/index.lazy";

import { CreatePlaylistDocument } from "../../../graphql/types";

const schema = z.object({
  name: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  onCancel: () => void;
};

export function CreateNew({ onCancel }: Props) {
  const navigate = Route.useNavigate();

  const [createPlaylist, { loading }] = useMutation(CreatePlaylistDocument);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onCancelClick = () => {
    form.reset({ name: "" });
    onCancel();
  };

  const onSubmit = async (values: FormValues) => {
    const { data } = await createPlaylist({
      variables: { input: { name: values.name } },
    });

    if (!data) {
      return;
    }

    form.reset({ name: "" });
    navigate({ to: "/p/$playlistID", params: { playlistID: data.createPlaylist.id.toString() } });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-4"
      >
        <InputFormItem control={form.control} name="name" label="Name" placeholder="My playlist" />

        <div className="flex gap-2">
          <Button variant="outline" type="reset" onClick={onCancelClick}>
            Cancel
          </Button>

          <Button type="submit" disabled={loading}>
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
}
