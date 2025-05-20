import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@workspace/ui/lib/utils";
import * as React from "react";

type Props = React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean;
};

function Label({ className, ...props }: Props) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex select-none items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className,
      )}
      aria-required={props.required}
      {...props}
    >
      {props.children}
      {props.required && (
        <span className="text-destructive -ml-1" aria-hidden>
          *
        </span>
      )}
    </LabelPrimitive.Root>
  );
}

export { Label };
