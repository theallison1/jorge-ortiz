import withPWA from '@ducanh2912/next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tus configuraciones de Next.js actuales (si tenías alguna, si no dejalo vacío)
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Solo se activa en producción (Render)
})(nextConfig);