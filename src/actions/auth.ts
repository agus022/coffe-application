"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", formData);

    return {};
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          error: "El correo o la contraseña son incorrectos.",
        };
      }

      return {
        error: "No fue posible iniciar sesión.",
      };
    }

    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({
    redirectTo: "/login",
  });
}