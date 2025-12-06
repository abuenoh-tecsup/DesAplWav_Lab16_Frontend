"use client";

import { useEffect, useState } from "react";
import { Home, Inbox, Calendar, Settings, LogOut, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export function AppSidebar() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/me`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
        }
      } catch (err) {
        console.error("No se pudo obtener el usuario:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Error de red al cerrar sesión");
    }
  };

  const items = [
    // Rutas para todos los usuarios
    { title: "Dashboard", url: "/dashboard", icon: Home, roles: ["USER"] },
    { title: "Tickets", url: "/tickets", icon: Inbox, roles: ["USER"] },
    { title: "Calendar", url: "/calendar", icon: Calendar, roles: ["USER"] },
    // Rutas solo para ADMIN
    { title: "Categorías", url: "/categories", icon: Layers, roles: ["ADMIN"] },
    {
      title: "Asignar Tickets",
      url: "/assignTicket",
      icon: Layers,
      roles: ["ADMIN"],
    },

    // Rutas solo para AGENT
    { title: "Mis Tickets", url: "/agent", icon: Inbox, roles: ["AGENT"] },
  ];

  // Mientras carga, podemos devolver null o un loader
  if (loading) return <div className="w-64 p-6">Cargando menú...</div>;

  return (
    <Sidebar className="w-64 bg-black border-r border-gray-900">
      <SidebarContent className="bg-[rgb(31,31,31)]">
        <SidebarGroup className="py-6">
          {/* Label */}
          <SidebarGroupLabel className="text-white text-xl font-bold mb-4">
            Solvio
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items
                .filter(
                  (item) =>
                    !item.roles || (userRole && item.roles.includes(userRole))
                )
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className="flex items-center gap-3 py-2 px-3 rounded text-white hover:bg-gray-800"
                      >
                        <item.icon className="w-5 h-5 text-white" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              {/* Logout */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-2 px-3 rounded w-full text-left text-white hover:bg-gray-800"
                  >
                    <LogOut className="w-5 h-5 text-white" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
