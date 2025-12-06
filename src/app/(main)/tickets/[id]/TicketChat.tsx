"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = { ticketId: string };

export default function TicketChat({ ticketId }: Props) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Placeholder: aquí luego se conectará el ticketService.addMessage
    console.log("Enviar mensaje para ticket", ticketId, message);
    setMessage("");
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Chat del Ticket</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 flex-1">
        <div className="flex-1 overflow-y-auto border rounded p-2 bg-gray-50">
          {/* Aquí irían los mensajes */}
          <p className="text-gray-400 text-sm">Mensajes del ticket...</p>
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
          />
          <Button onClick={handleSend}>Enviar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
