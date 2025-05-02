import React from "react";

import { Header } from "./header.js";
import { Footer } from "./footer.js";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <div className="container mx-auto px-2 sm:px-0">{children}</div>

      <Footer />
    </>
  );
}
