import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/pos", label: "POS" },
  { href: "/history/inbound", label: "Inbound History" },
  { href: "/history/outbound", label: "Outbound History" },
];

export default function Header() {
  const { logout } = useAuth();
  const router = useRouter();

  const isActive = (href: string) => router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <aside className="w-full bg-slate-950 text-slate-100 lg:sticky lg:top-0 lg:h-screen lg:w-64">
      <div className="flex flex-col border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 lg:h-full">
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 text-base font-semibold text-white shadow-lg shadow-indigo-500/30">
            POS
          </div>
          <div>
            <Link href="/products" className="text-lg font-semibold text-white">
              Cuslabs POS
            </Link>
            <p className="text-xs text-slate-400">Cuslabs POS</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={linkCls(isActive(item.href))}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-800 px-3 py-4">
          <button
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-center text-slate-100 transition hover:bg-slate-700"
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

function linkCls(active: boolean) {
  return [
    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
    active
      ? "bg-indigo-500/20 text-white ring-1 ring-indigo-400/70"
      : "text-slate-100 hover:bg-slate-800 hover:text-white",
  ].join(" ");
}

