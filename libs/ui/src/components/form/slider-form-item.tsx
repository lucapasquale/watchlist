import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form.js";
import { Slider } from "../ui/slider/index.js";

type Props<FormValue extends FieldValues> = React.ComponentProps<typeof Slider> & {
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
      data-slot="slider-form-item"
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full grow">
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
