import "dotenv/config";

import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está configurada.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  price: string;
  sortOrder: number;
};

type SeedSection = {
  name: string;
  slug: string;
  sortOrder: number;
  products: SeedProduct[];
};

type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  sections: SeedSection[];
};

const menu: SeedCategory[] = [
  {
    name: "Bebidas",
    slug: "bebidas",
    description: "Bebidas calientes, frías y especiales.",
    sortOrder: 1,
    sections: [
      {
        name: "Calientes",
        slug: "calientes",
        sortOrder: 1,
        products: [
          {
            name: "Americano",
            slug: "americano",
            description:
              "Café espresso combinado con agua caliente para obtener un sabor intenso y equilibrado.",
            price: "60.00",
            sortOrder: 1,
          },
          {
            name: "Capuchino",
            slug: "capuchino",
            description:
              "Espresso, leche vaporizada y una suave capa de espuma.",
            price: "75.00",
            sortOrder: 2,
          },
        ],
      },
      {
        name: "Frías",
        slug: "frias",
        sortOrder: 2,
        products: [
          {
            name: "Limonada",
            slug: "limonada",
            description:
              "Bebida refrescante preparada con limón natural.",
            price: "65.00",
            sortOrder: 1,
          },
        ],
      },
    ],
  },
  {
    name: "Brunch",
    slug: "brunch",
    description: "Platillos disponibles durante el horario de brunch.",
    sortOrder: 2,
    sections: [
      {
        name: "Principal",
        slug: "principal",
        sortOrder: 1,
        products: [
          {
            name: "Chilaquiles Brownella",
            slug: "chilaquiles-brownella",
            description:
              "Totopos bañados en salsa especial de la casa, acompañados con huevo.",
            price: "175.00",
            sortOrder: 1,
          },
          {
            name: "Omelette Clásico",
            slug: "omelette-clasico",
            description:
              "Omelette acompañado de queso, jamón y ensalada fresca.",
            price: "144.00",
            sortOrder: 2,
          },
        ],
      },
    ],
  },
  {
    name: "Sandwich & Baguette",
    slug: "sandwich-baguette",
    description: "Sandwiches y baguettes preparados al momento.",
    sortOrder: 3,
    sections: [
      {
        name: "Principal",
        slug: "principal",
        sortOrder: 1,
        products: [
          {
            name: "Steak Prime",
            slug: "steak-prime",
            description:
              "Baguette de res, queso y vegetales frescos.",
            price: "198.00",
            sortOrder: 1,
          },
          {
            name: "Club Sandwich",
            slug: "club-sandwich",
            description:
              "Sandwich con pollo, tocino, jamón, queso y vegetales.",
            price: "157.00",
            sortOrder: 2,
          },
        ],
      },
    ],
  },
  {
    name: "Ensaladas",
    slug: "ensaladas",
    description: "Ensaladas frescas preparadas al momento.",
    sortOrder: 4,
    sections: [
      {
        name: "Principal",
        slug: "principal",
        sortOrder: 1,
        products: [
          {
            name: "Ensalada Brownella",
            slug: "ensalada-brownella",
            description:
              "Mezcla de hojas verdes, vegetales, proteína y aderezo de la casa.",
            price: "150.00",
            sortOrder: 1,
          },
        ],
      },
    ],
  },
  {
    name: "Pizzas & Pastas",
    slug: "pizzas-pastas",
    description: "Pizzas artesanales y pastas especiales.",
    sortOrder: 5,
    sections: [
      {
        name: "Principal",
        slug: "principal",
        sortOrder: 1,
        products: [
          {
            name: "Pizza Pepperoni",
            slug: "pizza-pepperoni",
            description:
              "Pizza artesanal con salsa de tomate, queso y pepperoni.",
            price: "185.00",
            sortOrder: 1,
          },
        ],
      },
    ],
  },
];

async function seedAdmin(): Promise<void> {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL y ADMIN_PASSWORD son obligatorias.",
    );
  }

  if (password.length < 10) {
    throw new Error(
      "La contraseña inicial debe tener al menos 10 caracteres.",
    );
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name,
      passwordHash,
      isActive: true,
      role: "ADMIN",
    },
    create: {
      name,
      email,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });
}

async function seedMenu(): Promise<void> {
  for (const categoryData of menu) {
    const category = await prisma.category.upsert({
      where: {
        slug: categoryData.slug,
      },
      update: {
        name: categoryData.name,
        description: categoryData.description,
        sortOrder: categoryData.sortOrder,
        isActive: true,
      },
      create: {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        sortOrder: categoryData.sortOrder,
        isActive: true,
      },
    });

    for (const sectionData of categoryData.sections) {
      const section = await prisma.section.upsert({
        where: {
          categoryId_slug: {
            categoryId: category.id,
            slug: sectionData.slug,
          },
        },
        update: {
          name: sectionData.name,
          sortOrder: sectionData.sortOrder,
          isActive: true,
        },
        create: {
          categoryId: category.id,
          name: sectionData.name,
          slug: sectionData.slug,
          sortOrder: sectionData.sortOrder,
          isActive: true,
        },
      });

      for (const productData of sectionData.products) {
        await prisma.product.upsert({
          where: {
            sectionId_slug: {
              sectionId: section.id,
              slug: productData.slug,
            },
          },
          update: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            sortOrder: productData.sortOrder,
            isAvailable: true,
          },
          create: {
            sectionId: section.id,
            name: productData.name,
            slug: productData.slug,
            description: productData.description,
            price: productData.price,
            sortOrder: productData.sortOrder,
            isAvailable: true,
          },
        });
      }
    }
  }
}

async function main(): Promise<void> {
  await seedAdmin();
  await seedMenu();

  console.log("Base de datos Brownella inicializada correctamente.");
}

main()
  .catch((error: unknown) => {
    console.error("Error ejecutando el seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });