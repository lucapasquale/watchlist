import React from "react";

import { Header } from "./header.js";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <div className="container px-2 sm:px-8 my-4">{children}</div>
    </>
  );
}
