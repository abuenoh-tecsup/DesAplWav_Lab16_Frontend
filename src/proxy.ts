import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar archivos internos de Next y API de auth
  if (pathname.startsWith("/_next") || pathname.startsWith("/api/auth") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // Obtener token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Definir rutas públicas
  const publicRoutes = ["/", "/login", "/register"];
  const isPublic = publicRoutes.includes(pathname);

  // 1️⃣ Ruta pública y logueado → dashboard
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2️⃣ Ruta privada y NO logueado → login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3️⃣ Protecciones por rol
  if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/agent") && !["ADMIN", "AGENT"].includes(token?.role || "")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Se ejecuta en todas las rutas excepto archivos internos y API de auth
  matcher: ["/((?!_next|favicon.ico|api/auth).*)"],
};
