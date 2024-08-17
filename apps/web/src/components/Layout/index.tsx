import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="container max-w-4xl mx-auto px-4 my-16">{children}</main>
    </>
  );
}
