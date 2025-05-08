import React from "react";

import { Footer } from "./footer.js";
import { Header } from "./header.js";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
