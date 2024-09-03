import React from "react";

import { Header } from "./header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <div className="container mx-auto px-4 my-2">{children}</div>
    </>
  );
}
