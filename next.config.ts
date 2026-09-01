import type { NextConfig } from 'next';

/**
 * Variables de servidor que Amplify debe inyectar en runtime.
 * Se leen en amplify.yml → .env.production antes de `next build`.
 * El bloque `env` asegura que Next.js las embeba en el bundle SSR/standalone
 * (requerido en Amplify Hosting compute; ver guía SSR env vars).
 */
const serverEnv = {
  JWT_SECRET: process.env.JWT_SECRET,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  APP_ENV: process.env.APP_ENV,
} as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Amplify WEB_COMPUTE usa el artefacto standalone en runtime.
  // https://docs.aws.amazon.com/amplify/latest/userguide/troubleshooting-SSR.html
  output: 'standalone',

  env: {
    ...serverEnv,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // No usar `output: 'export'` — eliminaría los API routes de src/app/api/.

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
