import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { logout } = useAuth();
  const router = useRouter();

  const isActive = (href: string) => router.pathname === href;

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/inventory" className="text-lg font-semibold text-blue-600">
          POS UI
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link className={linkCls(isActive("/inventory"))} href="/inventory">
            Products
          </Link>
          <Link className={linkCls(isActive("/inventory/products/new"))} href="/inventory/products/new">
            New Product
          </Link>
          <Link className={linkCls(isActive("/inventory/categories"))} href="/inventory/categories">
            Categories
          </Link>
          <Link className={linkCls(isActive("/pos"))} href="/pos">
            POS
          </Link>
          <button
            className="rounded bg-gray-100 px-3 py-1 text-gray-700 transition hover:bg-gray-200"
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

function linkCls(active: boolean) {
  return [
    "rounded px-3 py-1 transition",
    active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100",
  ].join(" ");
}

