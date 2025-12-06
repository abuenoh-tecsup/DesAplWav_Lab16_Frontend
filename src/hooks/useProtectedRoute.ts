// hooks/useProtectedRoute.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "USER" | "ADMIN" | "AGENT";

type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

// Mapeo de roles a sus páginas home
const ROLE_HOME_PAGES: Record<UserRole, string> = {
  USER: "/dashboard",
  ADMIN: "/assignTicket",
  AGENT: "/agent",
};

type ProtectionConfig = {
  // Si requireAuth es true, necesita estar autenticado
  requireAuth?: boolean;
  
  // Si requireGuest es true, solo usuarios NO autenticados pueden acceder (ej: login, register)
  requireGuest?: boolean;
  
  // Roles permitidos (si está vacío, cualquier usuario autenticado puede acceder)
  allowedRoles?: UserRole[];
  
  // Rutas de redirección
  redirectTo?: string; // Ruta por defecto si no cumple requisitos
  redirectIfAuth?: string; // Ruta específica si está autenticado (para páginas de guest)
  redirectIfUnauth?: string; // Ruta específica si NO está autenticado
  redirectIfUnauthorized?: string; // Ruta específica si no tiene el rol requerido
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export function useProtectedRoute(config: ProtectionConfig = {}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const {
    requireAuth = false,
    requireGuest = false,
    allowedRoles = [],
    redirectTo = "/",
    redirectIfAuth, // Ahora será calculado según el rol
    redirectIfUnauth = "/login",
    redirectIfUnauthorized = "/unauthorized",
  } = config;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const userData: User = await res.json();
          setUser(userData);

          // ✅ Caso 1: Página solo para invitados (login, register)
          if (requireGuest) {
            // Redirigir al home según el rol del usuario
            const userHome = redirectIfAuth || ROLE_HOME_PAGES[userData.role];
            router.push(userHome);
            return;
          }

          // ✅ Caso 2: Verificar roles si están especificados
          if (allowedRoles.length > 0) {
            if (!allowedRoles.includes(userData.role)) {
              // Redirigir al home del rol del usuario en lugar de unauthorized
              const userHome = redirectIfUnauthorized === "/unauthorized" 
                ? ROLE_HOME_PAGES[userData.role]
                : redirectIfUnauthorized;
              router.push(userHome);
              return;
            }
          }

          // Usuario autenticado y autorizado
          setIsAuthorized(true);
        } else {
          // Usuario NO autenticado
          setUser(null);

          // ✅ Caso 3: Página requiere autenticación
          if (requireAuth) {
            router.push(redirectIfUnauth);
            return;
          }

          // ✅ Caso 4: Página pública o para invitados
          setIsAuthorized(true);
        }
      } catch (err) {
        console.error("Error verificando autenticación:", err);
        setUser(null);

        if (requireAuth) {
          router.push(redirectIfUnauth);
        } else {
          setIsAuthorized(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [
    requireAuth,
    requireGuest,
    allowedRoles,
    redirectTo,
    redirectIfAuth,
    redirectIfUnauth,
    redirectIfUnauthorized,
    router,
  ]);

  return {
    user,
    isLoading,
    isAuthorized,
    isAuthenticated: !!user,
  };
}