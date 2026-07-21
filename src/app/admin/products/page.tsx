import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const priceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [
      {
        section: {
          category: {
            sortOrder: "asc",
          },
        },
      },
      {
        sortOrder: "asc",
      },
    ],
    include: {
      section: {
        include: {
          category: true,
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
          Platillos
        </h1>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-4xl text-left">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-5 py-4">
                  Platillo
                </th>
                <th className="px-5 py-4">
                  Categoría
                </th>
                <th className="px-5 py-4">
                  Sección
                </th>
                <th className="px-5 py-4">
                  Precio
                </th>
                <th className="px-5 py-4">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold">
                      {product.name}
                    </p>

                    <p className="mt-1 max-w-md truncate text-xs text-neutral-500">
                      {product.description}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    {product.section.category.name}
                  </td>

                  <td className="px-5 py-4 text-neutral-500">
                    {product.section.name}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {priceFormatter.format(
                      Number(product.price),
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={
                        product.isAvailable
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                          : "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                      }
                    >
                      {product.isAvailable
                        ? "Disponible"
                        : "No disponible"}
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