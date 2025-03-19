import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form.js";
import { Slider, SliderProps } from "../ui/slider/index.js";

type Props<FormValue extends FieldValues> = SliderProps & {
  control: Control<FormValue>;
  name: Path<FormValue>;
  label?: React.ReactNode;
  description?: React.ReactNode;
};

export function SliderFormItem<FormValue extends FieldValues>({
  control,
  name,
  label,
  description,
  ...sliderProps
}: Props<FormValue>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="grow w-full">
          <FormLabel htmlFor={name}>{label}</FormLabel>

          <FormControl>
            <Slider
              id={name}
              {...sliderProps}
              ref={field.ref}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                sliderProps.onValueChange?.(value);
              }}
              onBlur={(e) => {
                field.onBlur();
                sliderProps.onBlur?.(e);
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
