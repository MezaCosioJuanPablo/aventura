/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para manejar errores de Axios de manera más elegante
  onDemandEntries: {
    // Período de tiempo que una página debe permanecer en el buffer
    maxInactiveAge: 25 * 1000,
    // Número de páginas que deben mantenerse simultáneamente
    pagesBufferLength: 2,
  },

  // Configuración para el logging
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

module.exports = nextConfig;
