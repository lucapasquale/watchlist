import { UseFormReturn } from "react-hook-form";

import { FormValues } from "./schema";

type Props = {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
};

export function PlaylistForm({ form, onSubmit }: Props) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <label>
        Name
        <input {...form.register("name")} />
      </label>

      {form.formState.errors.name && <p>{form.formState.errors.name.message}</p>}

      <button type="submit">Save</button>
    </form>
  );
}
