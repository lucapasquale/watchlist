import React from "react";

import { Header } from "./header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <div className="container mx-auto px-8 my-4">{children}</div>
    </>
  );
}
