import React from "react";

type Size = {
  width: number;
  height: number;
};

export function useComponentSize(ref: React.RefObject<HTMLElement | null>, deps: any[] = []): Size {
  const [size, setSize] = React.useState<Size>({ width: 0, height: 0 });

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const updateSize = () => {
      setSize({
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref, ...deps]);

  return size;
}
