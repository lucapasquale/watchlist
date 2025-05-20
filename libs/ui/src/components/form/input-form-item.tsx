import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form.js";
import { Input } from "../ui/input.js";

type Props<FormValue extends FieldValues> = React.ComponentProps<typeof Input> & {
  control: Control<FormValue>;
  name: Path<FormValue>;
  required?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
};

export function InputFormItem<FormValue extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  ...inputProps
}: Props<FormValue>) {
  return (
    <FormField
      data-slot="input-form-item"
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full grow">
          <FormLabel htmlFor={name} required={required}>
            {label}
          </FormLabel>

          <FormControl>
            <Input
              id={name}
              {...inputProps}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                inputProps.onChange?.(e);
              }}
              onBlur={(e) => {
                field.onBlur();
                inputProps.onBlur?.(e);
              }}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
