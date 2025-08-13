"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log del error global para debugging
    console.error("Error global capturado:", error);

    // Si es un error de Axios, manejarlo silenciosamente
    if (error.message && error.message.includes("AxiosError")) {
      console.log("Error global de Axios, manejado silenciosamente");
      return;
    }
  }, [error]);

  // Para errores de Axios, no mostrar nada
  if (error.message && error.message.includes("AxiosError")) {
    return null;
  }

  // Para otros errores globales, mostrar un mensaje simple
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error del Sistema
            </h2>
            <p className="text-gray-600 mb-6">
              Ha ocurrido un error crítico. Por favor, recarga la página.
            </p>
            <button
              onClick={() => reset()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Recargar página
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
