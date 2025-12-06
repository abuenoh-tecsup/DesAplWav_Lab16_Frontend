"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

type LoginForm = {
  email: string;
  password: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<LoginForm>();
  const { errors } = formState;

  // Función para redirigir según rol
  const redirectByRole = (role: string) => {
    if (role === "ADMIN") router.push("/assignTicket");
    else if (role === "AGENT") router.push("/agent");
    else router.push("/dashboard");
  };

  // Verificar sesión activa al montar la página
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const user = await res.json();
          redirectByRole(user.role);
        }
      } catch (err) {
        console.error("No hay sesión activa:", err);
      }
    };
    checkSession();
  }, [router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        alert("Credenciales incorrectas");
        return;
      }

      // Obtener usuario recién logueado y redirigir según rol
      const userRes = await fetch(`${BACKEND_URL}/api/users/me`, {
        method: "GET",
        credentials: "include",
      });
      if (userRes.ok) {
        const user = await userRes.json();
        redirectByRole(user.role);
      } else {
        router.push("/dashboard"); // fallback
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
          <CardTitle className="text-center">Iniciar sesión</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input placeholder="Email" {...register("email", { required: true })} />
            {errors.email && <p className="text-red-500 text-sm">Email requerido</p>}

            <Input placeholder="Password" type="password" {...register("password", { required: true })} />
            {errors.password && <p className="text-red-500 text-sm">Password requerido</p>}

            <Button type="submit">Entrar</Button>
          </form>

          <div className="flex flex-col gap-2 mt-4 text-center text-sm text-gray-600">
            <p>
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Regístrate
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
