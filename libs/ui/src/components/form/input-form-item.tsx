import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form.js";
import { Input, InputProps } from "../ui/input.js";

type Props<FormValue extends FieldValues> = InputProps & {
  control: Control<FormValue>;
  name: Path<FormValue>;
  label?: React.ReactNode;
  description?: React.ReactNode;
};

export function InputFormItem<FormValue extends FieldValues>({
  control,
  name,
  label,
  description,
  ...inputProps
}: Props<FormValue>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="grow w-full">
          <FormLabel htmlFor={name}>{label}</FormLabel>

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
