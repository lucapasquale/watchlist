import React from "react";
import { twMerge } from "tailwind-merge";
import { Link as TanstackLink } from "@tanstack/react-router";

type LinkProps = Pick<
  React.ComponentProps<typeof TanstackLink>,
  "to" | "params" | "search" | "className"
>;

type Props = LinkProps & { children: React.ReactNode };

export function Link({ children, className, ...props }: Props) {
  if (props.to?.startsWith("http")) {
    return (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        href={props.to}
        className={twMerge("transition-colors text-blue-500 hover:text-blue-400", className)}
      >
        {children}
      </a>
    );
  }

  return (
    <TanstackLink
      {...props}
      className={twMerge("transition-colors text-blue-500 hover:text-blue-400", className)}
    >
      {children}
    </TanstackLink>
  );
}
