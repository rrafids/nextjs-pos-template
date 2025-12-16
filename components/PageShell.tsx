import { ReactNode } from "react";
import Header from "./Header";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex flex-col lg:flex-row">
        <Header />
        <main className="flex-1 px-4 py-6 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

