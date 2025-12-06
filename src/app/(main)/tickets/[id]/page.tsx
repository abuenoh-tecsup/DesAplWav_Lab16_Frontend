"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api";

interface Message {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  agent?: {
    id: string;
    name: string;
    email: string;
  };
  Category: {
    id: string;
    name: string;
  };
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En Progreso",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
};

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchTicket();
    fetchMessages();
  }, [ticketId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient("/users/me");
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  };

  const fetchTicket = async () => {
    try {
      const response = await apiClient(`/tickets/${ticketId}`);
      if (response.ok) {
        const data = await response.json();
        setTicket(data);
      } else {
        alert("Error al cargar el ticket");
        router.push("/tickets");
      }
    } catch (error) {
      console.error("Error al cargar ticket:", error);
      alert("Error al cargar el ticket");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await apiClient(`/tickets/${ticketId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    setSending(true);
    try {
      const response = await apiClient(`/tickets/${ticketId}/messages`, {
        method: "POST",
        body: JSON.stringify({
          authorId: currentUser.id,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages();
      } else {
        alert("Error al enviar mensaje");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Error al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Ticket no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <Button
        variant="outline"
        onClick={() => router.push("/tickets")}
        className="mb-4"
      >
        ← Volver a tickets
      </Button>

      {/* Información del Ticket */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{ticket.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Creado el {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                {STATUS_LABELS[ticket.status]}
              </span>
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm">
                {PRIORITY_LABELS[ticket.priority]}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Descripción:</p>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Categoría:</p>
                <p className="text-muted-foreground">{ticket.Category.name}</p>
              </div>
              <div>
                <p className="font-semibold">Creado por:</p>
                <p className="text-muted-foreground">
                  {ticket.user.name} ({ticket.user.email})
                </p>
              </div>
              {ticket.agent && (
                <div>
                  <p className="font-semibold">Agente asignado:</p>
                  <p className="text-muted-foreground">
                    {ticket.agent.name} ({ticket.agent.email})
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensajes */}
      <Card>
        <CardHeader>
          <CardTitle>Mensajes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay mensajes aún. Sé el primero en comentar.
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.authorId === currentUser?.id
                      ? "bg-blue-50 ml-8"
                      : "bg-gray-50 mr-8"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{message.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.author.role}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Formulario para nuevo mensaje */}
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                disabled={sending}
              />
            </div>
            <Button type="submit" disabled={sending || !newMessage.trim()}>
              {sending ? "Enviando..." : "Enviar Mensaje"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
