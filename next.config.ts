import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // IMPORTANTE para AWS Amplify:
  // No se define `output: 'export'`. Al dejarlo fuera, Amplify detecta la app
  // como SSR y la despliega en la plataforma WEB_COMPUTE — que es lo que hace
  // que funcionen los route handlers de src/app/api/.
  //
  // Con `output: 'export'` el sitio sería estático y los 9 endpoints
  // desaparecerían, que es exactamente el problema que tiene hoy en Vercel.

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
