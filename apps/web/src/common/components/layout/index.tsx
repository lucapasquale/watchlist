import React from "react";

import { Header } from "./header.js";
import { Footer } from "./footer.js";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
