import Link from "next/link";
import { notFound } from "next/navigation";

import ProductCard from "@/components/menu/product-card";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { categorySlug } = await params;

  const category = await prisma.category.findFirst({
    where: {
      slug: categorySlug,
      isActive: true,
    },
    include: {
      sections: {
        where: {
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          products: {
            where: {
              isAvailable: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const totalProducts = category.sections.reduce(
    (total, section) => total + section.products.length,
    0,
  );

  return (
    <main className="min-h-screen bg-[#171717] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#171717]/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center">
          <Link
            href="/menu"
            className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:bg-white hover:text-neutral-900"
          >
            ← Menú
          </Link>

          <div className="mx-auto pr-20 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">
              Brownella
            </p>

            <h1 className="font-display text-2xl uppercase sm:text-3xl">
              {category.name}
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        {category.sections.map((section) => (
          <section
            key={section.id}
            id={section.slug}
            className="mb-14"
          >
            {category.sections.length > 1 && (
              <h2 className="mb-8 text-center font-display text-4xl uppercase">
                {section.name}
              </h2>
            )}

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {section.products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  description={product.description}
                  price={Number(product.price)}
                  imageUrl={product.imageUrl}
                />
              ))}
            </div>
          </section>
        ))}

        {totalProducts === 0 && (
          <div className="rounded-2xl border border-white/10 p-8 text-center text-white/60">
            No hay productos disponibles en esta categoría.
          </div>
        )}
      </div>
    </main>
  );
}