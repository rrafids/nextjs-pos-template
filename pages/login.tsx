import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, token, authReady } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    if (authReady && token) {
      router.replace("/products").catch(() => {});
    }
  }, [authReady, token, router]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(name);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <div className="card w-full max-w-md border-slate-800/60 bg-slate-900 text-slate-50 shadow-xl shadow-indigo-500/10">
        <h1 className="mb-2 text-center text-2xl font-semibold text-white">Cuslabs POS</h1>
        <p className="mb-6 text-center text-sm text-slate-300">Login to continue</p>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">Name</label>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:bg-indigo-700"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

