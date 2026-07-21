import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [
    categories,
    sections,
    products,
    availableProducts,
  ] = await Promise.all([
    prisma.category.count(),
    prisma.section.count(),
    prisma.product.count(),
    prisma.product.count({
      where: {
        isAvailable: true,
      },
    }),
  ]);

  const cards = [
    {
      label: "Categorías",
      value: categories,
    },
    {
      label: "Secciones",
      value: sections,
    },
    {
      label: "Platillos",
      value: products,
    },
    {
      label: "Disponibles",
      value: availableProducts,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-neutral-500">
          Administración
        </p>

        <h1 className="mt-1 text-3xl font-bold text-neutral-900">
          Resumen del menú
        </h1>
      </div>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-neutral-500">
              {card.label}
            </p>

            <p className="mt-3 text-4xl font-bold text-neutral-900">
              {card.value}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}