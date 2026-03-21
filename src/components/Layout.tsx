import { Footer } from "./Footer";
import type React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-full flex-col items-center ">
      {children}
      <Footer />
    </main>
  );
}
