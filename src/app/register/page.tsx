"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    const res = await apiClient("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) router.push("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Card className="w-96 p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Crear cuenta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input placeholder="Nombre" {...register("name")} />
            <Input placeholder="Email" type="email" {...register("email")} />
            <Input
              placeholder="Password"
              type="password"
              {...register("password")}
            />
            <Button type="submit">Registrarse</Button>
          </form>

          {/* Opciones de navegación */}
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
