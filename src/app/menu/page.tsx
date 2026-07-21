import Link from "next/link";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[#171717] text-white">
      <header className="border-b border-white/10 px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 font-display text-2xl">
            B
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.35em] text-white/60">
            Brownella Café
          </p>

          <h1 className="font-display text-5xl sm:text-6xl">
            Menú
          </h1>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu/${category.slug}`}
              className="group relative flex min-h-44 overflow-hidden rounded-3xl border border-white/10 bg-[#202020] p-6 transition hover:-translate-y-1 hover:border-white/30"
            >
              <div className="relative z-10 flex flex-1 flex-col justify-center">
                <h2 className="font-display text-3xl uppercase sm:text-4xl">
                  {category.name}
                </h2>

                {category.description && (
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
                    {category.description}
                  </p>
                )}

                <span className="mt-5 text-sm font-semibold text-white/80">
                  Ver productos →
                </span>
              </div>

              <div className="ml-4 flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#f7f4ef] font-display text-5xl text-neutral-900 shadow-xl transition group-hover:scale-105 sm:h-32 sm:w-32">
                {category.name.charAt(0)}
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="rounded-2xl border border-white/10 p-8 text-center text-white/60">
            El menú todavía no tiene categorías disponibles.
          </div>
        )}
      </section>
    </main>
  );
}