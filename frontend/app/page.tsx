export default function HomePage() {
  return (
    <div className="p-10 text-center text-black">
      <h1 className="text-4xl font-bold mb-4">🚗 Sistema OrtizAutomotores</h1>
      <p className="text-gray-600 text-lg">Bienvenido al panel de administración.</p>
      <a href="/vehicles" className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded-md font-bold">
        Ir al Catálogo de Vehículos
      </a>
    </div>
  );
}