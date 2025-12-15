import { ReactNode } from "react";
import Header from "./Header";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

