import React from "react";

import { Header } from "./header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <div className="container my-4">{children}</div>
    </>
  );
}
