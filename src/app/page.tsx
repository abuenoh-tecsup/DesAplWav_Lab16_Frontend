import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-96 p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Bienvenido a Solvio
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 mt-4">
          <p className="text-center text-gray-700">
            Tu sistema de tickets para gestionar incidencias de forma rápida y sencilla.
          </p>

          <div className="flex flex-col gap-2 mt-4">
            <Link href="/login">
              <Button className="w-full">Iniciar sesión</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Registrarse
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
