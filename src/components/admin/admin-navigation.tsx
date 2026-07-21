import Link from "next/link";

import { logoutAction } from "@/actions/auth";

type AdminNavigationProps = {
  userName: string;
};

export default function AdminNavigation({
  userName,
}: AdminNavigationProps) {
  return (
    <aside className="flex w-full flex-col bg-neutral-950 text-white lg:min-h-screen lg:w-72">
      <div className="border-b border-white/10 p-6">
        <p className="font-display text-3xl">
          Brownella
        </p>

        <p className="mt-1 text-xs text-white/50">
          Panel administrativo
        </p>
      </div>

      <nav className="flex flex-1 gap-2 overflow-x-auto p-4 lg:flex-col">
        <Link
          href="/admin"
          className="whitespace-nowrap rounded-xl px-4 py-3 text-sm transition hover:bg-white/10"
        >
          Resumen
        </Link>

        <Link
          href="/admin/categories"
          className="whitespace-nowrap rounded-xl px-4 py-3 text-sm transition hover:bg-white/10"
        >
          Categorías
        </Link>

        <Link
          href="/admin/products"
          className="whitespace-nowrap rounded-xl px-4 py-3 text-sm transition hover:bg-white/10"
        >
          Platillos
        </Link>

        <Link
          href="/menu"
          target="_blank"
          className="whitespace-nowrap rounded-xl px-4 py-3 text-sm transition hover:bg-white/10"
        >
          Ver menú público
        </Link>
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="mb-3 truncate px-2 text-xs text-white/50">
          {userName}
        </p>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-xl border border-white/20 px-4 py-3 text-left text-sm transition hover:bg-white hover:text-neutral-900"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}