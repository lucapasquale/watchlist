import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@workspace/ui/lib/utils";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip.js";

import { Mark } from "./mark.js";

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  formatValue?: (value: number) => React.ReactNode;
  marks?: number[];
};

function Slider({ className, formatValue = (v) => v, ...props }: SliderProps) {
  const [showTooltip, _setShowTooltip] = React.useState(props.value?.map(() => false) ?? [false]);

  const setShowTooltip = React.useCallback((index: number, value: boolean) => {
    return _setShowTooltip((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const allMarks = React.useMemo(() => {
    if (!props.marks || props.min === undefined || props.max === undefined) {
      return undefined;
    }

    return [props.min, ...props.marks, props.max];
  }, [props.marks, props.min, props.max]);

  return (
    <div className="flex flex-col gap-2">
      <SliderPrimitive.Root
        data-slot="slider"
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>

        {props.value ? (
          props.value.map((_value, index) => (
            <TooltipProvider key={index}>
              <Tooltip open={showTooltip[index]}>
                <TooltipTrigger asChild>
                  <SliderPrimitive.Thumb
                    onMouseEnter={() => setShowTooltip(index, true)}
                    onMouseLeave={() => setShowTooltip(index, false)}
                    className={cn(
                      "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                      index === 0 ? "left-0" : "right-0",
                    )}
                  />
                </TooltipTrigger>

                <TooltipContent>
                  <p>{formatValue(props.value?.[index] ?? 0)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))
        ) : (
          <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        )}
      </SliderPrimitive.Root>

      {allMarks && (
        <div className="relative h-6 w-full">
          {allMarks.map((markValue, idx) => (
            <Mark
              key={idx}
              value={markValue}
              min={props.min ?? 0}
              max={props.max ?? 100}
              formatValue={formatValue}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { Slider };
