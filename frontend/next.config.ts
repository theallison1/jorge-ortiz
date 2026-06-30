import withPWA from '@ducanh2912/next-pwa';

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development', // Sigue desactivado en desarrollo
});

// Dejamos el objeto de configuración base totalmente vacío
const nextConfig = {};

export default pwaConfig(nextConfig);