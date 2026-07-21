import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      _count: {
        select: {
          sections: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-neutral-500">
          Menú
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Categorías
        </h1>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-2xl text-left">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-5 py-4">
                  Orden
                </th>
                <th className="px-5 py-4">
                  Categoría
                </th>
                <th className="px-5 py-4">
                  Slug
                </th>
                <th className="px-5 py-4">
                  Secciones
                </th>
                <th className="px-5 py-4">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-5 py-4">
                    {category.sortOrder}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {category.name}
                  </td>

                  <td className="px-5 py-4 text-neutral-500">
                    {category.slug}
                  </td>

                  <td className="px-5 py-4">
                    {category._count.sections}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={
                        category.isActive
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                          : "rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600"
                      }
                    >
                      {category.isActive
                        ? "Activa"
                        : "Oculta"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}