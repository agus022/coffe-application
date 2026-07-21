import Image from "next/image";

type ProductCardProps = {
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
};

const priceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export default function ProductCard({
  name,
  description,
  price,
  imageUrl,
}: ProductCardProps) {
  return (
    <article className="relative flex min-h-72 flex-col overflow-hidden rounded-2xl bg-[#f7f4ef] text-neutral-900 shadow-lg">
      <div className="relative h-32 w-full overflow-hidden bg-neutral-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-300 text-5xl">
            ☕
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-center text-sm font-bold">
          {name}
        </h3>

        <p className="mt-3 line-clamp-4 text-xs leading-5 text-neutral-600">
          {description}
        </p>

        <p className="mt-auto pt-4 text-center text-sm font-semibold">
          {priceFormatter.format(price)}
        </p>
      </div>
    </article>
  );
}