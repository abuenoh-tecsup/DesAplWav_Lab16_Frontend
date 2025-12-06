"use client";

import { Home, Inbox, Calendar, Settings, LogOut } from "lucide-react";
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

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Tickets", url: "/tickets", icon: Inbox },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Settings },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/login");
      } else {
        console.error("Error cerrando sesión");
        alert("Error cerrando sesión");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al cerrar sesión");
    }
  };

  return (
    <Sidebar className="w-64 border-r border-gray-200 bg-white">
      <SidebarContent>
        <SidebarGroup className="py-6">
          <SidebarGroupLabel className="text-xl font-bold text-gray-900 mb-4">
            Solvio
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a className="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100" href={item.url}>
                      <item.icon />
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
                    className="flex items-center gap-3 py-2 px-3 rounded w-full text-left hover:bg-gray-100"
                  >
                    <LogOut />
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
