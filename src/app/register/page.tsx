"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function RegisterPage() {
  const router = useRouter();
  const { register: formRegister, handleSubmit } = useForm<RegisterForm>();

  // Función para redirigir según rol
  const redirectByRole = (role: string) => {
    if (role === "ADMIN") router.push("/assignTicket");
    else if (role === "AGENT") router.push("/agent");
    else router.push("/dashboard");
  };

  // 🔒 Verificar sesión activa al montar la página
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const user = await res.json();
          redirectByRole(user.role); // redirigir automáticamente
        }
      } catch (err) {
        console.error("No hay sesión activa:", err);
      }
    };
    checkSession();
  }, [router]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await apiClient("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        alert("Error al crear la cuenta");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen body-pattern">
      <Card className="w-96 p-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4">
          {/* Logo */}
          <Image
            src="/images/solvio_logo.png"
            alt="Solvio Logo"
            width={150} // ajustar según tu diseño
            height={50} // ajustar según tu diseño
            priority
          />
          <CardTitle className="text-center">Crear cuenta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input placeholder="Nombre" {...formRegister("name")} />
            <Input
              placeholder="Email"
              type="email"
              {...formRegister("email")}
            />
            <Input
              placeholder="Password"
              type="password"
              {...formRegister("password")}
            />
            <Button type="submit">Registrarse</Button>
          </form>

          <div className="flex flex-col gap-2 mt-4 text-center text-sm text-gray-600">
            <p>
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Inicia sesión
              </Link>
            </p>
            <p>
              <Link href="/" className="text-gray-800 hover:underline">
                Volver a inicio
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
