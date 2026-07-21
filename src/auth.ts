import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import prisma from "@/lib/prisma";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("El correo electrónico no es válido."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(72, "La contraseña no puede superar 72 caracteres."),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },

  providers: [
    Credentials({
      name: "Credenciales",

      credentials: {
        email: {
          label: "Correo electrónico",
          type: "email",
        },
        password: {
          label: "Contraseña",
          type: "password",
        },
      },

      authorize: async (credentials) => {
        const validation = loginSchema.safeParse(credentials);

        if (!validation.success) {
          return null;
        }

        const email = validation.data.email.toLowerCase();

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const validPassword = await compare(
          validation.data.password,
          user.passwordHash,
        );

        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
  jwt({ token, user }) {
    if (user?.role === "ADMIN") {
      token.role = user.role;
    }

    return token;
  },

  session({ session, token }) {
    if (session.user) {
      session.user.id = token.sub ?? "";

      session.user.role =
        token.role === "ADMIN"
          ? token.role
          : "ADMIN";
    }

    return session;
  },
},
});