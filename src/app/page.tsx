import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex h-screen w-screen">
      {/* Lado visual con patrón gris oscuro */}
      <div className="hidden md:flex w-1/2 bg-gray-800 body-pattern items-center justify-center">
        <div className="text-center px-8">
          <h1 className="text-white text-4xl font-bold mb-4">Solvio</h1>
          <p className="text-gray-300 text-lg">
            Gestiona tus tickets e incidencias de manera rápida y sencilla.
          </p>
        </div>
      </div>

      {/* Lado funcional */}
      <div className="flex flex-col w-full md:w-1/2 justify-center items-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/images/solvio_logo.png"
              alt="Solvio Logo"
              width={150}
              height={50}
              priority
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Bienvenido a Solvio
            </h2>
          </div>

          <p className="text-center text-gray-700 mb-6">
            Tu sistema de tickets para gestionar incidencias de forma rápida y sencilla.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/login">
              <Button className="w-full">Iniciar sesión</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
