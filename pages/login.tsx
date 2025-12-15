import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, token, authReady } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    if (authReady && token) {
      router.replace("/inventory").catch(() => {});
    }
  }, [authReady, token, router]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(name);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow">
        <h1 className="mb-4 text-center text-2xl font-semibold text-gray-900">POS Login</h1>
        <p className="mb-6 text-center text-sm text-gray-600">Dummy login, no password required.</p>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name (optional)</label>
            <input placeholder="Cashier name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <button type="submit" className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

