"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateTicketCard() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/tickets");
  };

  return (
    <Card className="w-full flex items-center justify-between p-6">
      <div>
        <CardTitle>Crear nuevo ticket</CardTitle>
        <CardDescription>
          Gestiona tus solicitudes o reporta problemas rápidamente.
        </CardDescription>
      </div>
      <Button onClick={handleClick}>Nuevo Ticket</Button>
    </Card>
  );
}
