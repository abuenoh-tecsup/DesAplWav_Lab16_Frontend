"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginForm = {
  email: string;
  password: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<LoginForm>();
  const { errors } = formState;

  // ✅ Verificar sesión activa al montar la página
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/me`, {
          method: "GET",
          credentials: "include", // ← enviar cookies
        });
        if (res.ok) {
          router.push("/dashboard"); // ya logueado → ir al dashboard
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
        credentials: "include", // ← guardar cookie httpOnly
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        alert("Credenciales incorrectas");
        return;
      }

      // Cookie httpOnly guardada automáticamente
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error de red");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Card className="w-96 p-6 shadow-lg">
        <CardHeader>
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
