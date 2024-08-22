import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input, InputProps } from "../ui/input";

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
        <FormItem className="grow">
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Input
              {...inputProps}
              {...field}
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
