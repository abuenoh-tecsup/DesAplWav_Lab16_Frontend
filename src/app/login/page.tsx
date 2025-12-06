"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginForm = {
  email: string;
  password: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api";

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>();
  const [error, setError] = useState("");

  const onSubmit = async (data: LoginForm) => {
    try {
      // 1. Login directo al backend para obtener el token
      const backendRes = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!backendRes.ok) {
        setError("Credenciales inválidas");
        return;
      }

      const backendData = await backendRes.json();
      
      // Si el backend devuelve el token, guardarlo en localStorage
      if (backendData.token) {
        localStorage.setItem('backendToken', backendData.token);
      }

      // 2. También hacer login en NextAuth para mantener la sesión local
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!res?.error) {
        router.push("/dashboard");
      } else {
        setError("Error al iniciar sesión");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Card className="w-96 p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input placeholder="Email" {...register("email")} />
            <Input placeholder="Password" type="password" {...register("password")} />
            <Button type="submit">Entrar</Button>
          </form>

          {/* Opciones de navegación */}
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
