"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Rutas que NO requieren autenticación
  const publicRoutes = ["/login", "/register"];

  useEffect(() => {
    // Si no está autenticado y no está en una ruta pública, redirigir al login
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      console.log("Usuario no autenticado, redirigiendo al login");
      router.push("/login");
      return;
    }

    // Si está autenticado y está en login/register, redirigir a la página principal
    if (isAuthenticated && publicRoutes.includes(pathname)) {
      console.log("Usuario autenticado, redirigiendo a la página principal");
      router.push("/");
      return;
    }
  }, [isAuthenticated, pathname, router]);

  // Si no está autenticado y no está en una ruta pública, mostrar loading
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si está en una ruta pública, mostrar el contenido directamente
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Si está autenticado y no está en una ruta pública, mostrar el contenido protegido
  return <>{children}</>;
}
