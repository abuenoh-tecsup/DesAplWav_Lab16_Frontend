"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { ticketService } from "@/services/ticketService";
import { Message } from "@/types";

type Props = { ticketId: string; className?: string };

export default function TicketChat({ ticketId, className }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Cargar mensajes al montar
  useEffect(() => {
    if (!ticketId) return;

    const fetchMessages = async () => {
      try {
        const msgs = await ticketService.getMessages(ticketId);
        msgs.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setMessages(msgs);
      } catch (err) {
        console.error("Error obteniendo mensajes:", err);
      }
    };

    fetchMessages();
  }, [ticketId]);

  // Función para enviar mensaje
  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      // Solo enviamos el contenido, el backend asigna el authorId
      const newMessage = await ticketService.addMessage(ticketId, { content: message });

      // Actualizamos la lista
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");

      // Scroll al final
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      alert("No se pudo enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`flex flex-col h-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Chat del Ticket</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 flex-1">
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto border rounded p-2 bg-gray-50 space-y-2"
        >
          {messages.length === 0 && (
            <p className="text-gray-400 text-sm">Aún no hay mensajes</p>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className="p-2 rounded bg-white shadow-sm">
              <p className="text-sm font-semibold">{msg.author?.name || "Desconocido"}</p>
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !message.trim()}>
            Enviar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
