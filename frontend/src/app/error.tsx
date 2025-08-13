"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log del error para debugging
    console.error("Error capturado por error.tsx:", error);

    // Si es un error de Axios (error de red), no mostrar el overlay
    if (error.message && error.message.includes("AxiosError")) {
      console.log("Error de Axios detectado, manejado silenciosamente");
      return;
    }
  }, [error]);

  // Para errores de Axios, no mostrar nada (manejados por el componente)
  if (error.message && error.message.includes("AxiosError")) {
    return null;
  }

  // Para otros errores, mostrar el componente de error estándar
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Algo salió mal
        </h2>
        <p className="text-gray-600 mb-6">
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
