"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

// Mapear roles a su home
const ROLE_HOME_PAGES: Record<string, string> = {
  USER: "/dashboard",
  ADMIN: "/assignTicket",
  AGENT: "/agent",
};

// Mapa de rutas → roles permitidos
const ROUTE_ROLES: Record<string, string[]> = {
  "/dashboard": ["USER"],
  "/tickets": ["USER"],
  "/calendar": ["USER"],
  "/categories": ["ADMIN"],
  "/assignTicket": ["ADMIN"],
  "/agent": ["AGENT"],
  "/login": [],
  "/register": [],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<{ role: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);

          // Si no está autenticado y la ruta requiere auth → redirigir a login
          if (ROUTE_ROLES[pathname]?.length) {
            if (pathname !== "/login") router.push("/login");
          }

          return;
        }

        const data = await res.json();
        setUser(data);

        // Si la ruta actual es pública (login/register), redirigir al home del rol
        if (["/login", "/register", "/"].includes(pathname)) {
          const target = ROLE_HOME_PAGES[data.role] || "/dashboard";
          if (pathname !== target) router.push(target);
        } else {
          // Si la ruta actual tiene restricción de rol
          const allowedRoles = ROUTE_ROLES[pathname];
          if (allowedRoles && allowedRoles.length && !allowedRoles.includes(data.role)) {
            const target = ROLE_HOME_PAGES[data.role] || "/dashboard";
            if (pathname !== target) router.push(target);
          }
        }
      } catch (err) {
        console.error("Error verificando sesión:", err);
        setUser(null);
        if (ROUTE_ROLES[pathname]?.length && pathname !== "/login") {
          router.push("/login");
        }
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
