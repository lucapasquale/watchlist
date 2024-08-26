import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky h-[90px] top-0 z-10 py-6 w-full bg-background/80 duration-120 backdrop-blur border-0 border-b border-solid border-gray-500"></header>

      <main className="container mx-auto px-4 my-2">{children}</main>
    </>
  );
}
