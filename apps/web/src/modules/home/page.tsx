import { useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { SliderFormItem } from "@ui/components/form/slider-form-item";
import { Button } from "@ui/components/ui/button";
import { Form } from "@ui/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { HomePlaylistsDocument } from "~common/graphql-types";

export function Page() {
  const { data } = useQuery(HomePlaylistsDocument);

  if (!data) {
    return <main>Loading...</main>;
  }

  return (
    <main className="flex flex-col gap-8">
      <section>
        <h2 className="text-xl mb-6">Playlists:</h2>

        <ol className="flex flex-col gap-8">
          {data.playlists.map((playlist) => (
            <li key={playlist.id}>
              <Link to="/p/$playlistID" params={{ playlistID: playlist.id.toString() }}>
                {playlist.name}
              </Link>
            </li>
          ))}
        </ol>

        <div className="container max-w-[500px]">
          <TestForm />
        </div>
      </section>
    </main>
  );
}

const schema = z.object({
  slider: z.tuple([z.number(), z.number()]),
});
type FormValues = z.infer<typeof schema>;

function TestForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { slider: [0, 100] },
  });

  const onSubmit = async (values: FormValues) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        id="test"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-4"
      >
        <SliderFormItem
          control={form.control}
          name="slider"
          label="Slider"
          min={0}
          max={100}
          marks={[9, 15, 25, 50, 78]}
        />

        <Button type="submit" form="test" disabled={!form.formState.isValid}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
