import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form.js";
import { Select } from "../ui/select.js";

type Props<FormValue extends FieldValues> = React.ComponentProps<typeof Select> & {
  control: Control<FormValue>;
  name: Path<FormValue>;
  label?: React.ReactNode;
  description?: React.ReactNode;
};

export function SelectFormItem<FormValue extends FieldValues>({
  control,
  name,
  label,
  description,
  ...selectProps
}: Props<FormValue>) {
  return (
    <FormField
      data-slot="input-form-item"
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="grow w-full">
          <FormLabel htmlFor={name}>{label}</FormLabel>

          <FormControl>
            <Select
              {...selectProps}
              {...field}
              defaultValue={field.value}
              onValueChange={field.onChange}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
