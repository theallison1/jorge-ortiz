'use client';
import { useState, useEffect } from 'react';

interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  precio: string;
  estado: string;
}

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const URL_BACKEND = 'http://localhost:4000/api/vehicles';

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(URL_BACKEND);
        if (!res.ok) throw new Error("Error al traer datos");
        const data = await res.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error en dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // 🧮 CALCULADOR DE MÉTRICAS REALES
  const totalStock = vehicles.length;
  const disponibles = vehicles.filter(car => car.estado === 'Disponible').length;
  const vendidos = vehicles.filter(car => car.estado === 'Vendido').length;

  if (loading) return <div className="p-6 text-center font-semibold text-black">Calculando métricas... 📈</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-6">Panel de Control - Ortiz Automotores</h1>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Total en Stock</p>
          <p className="text-4xl font-black text-blue-600 mt-2">{totalStock}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Vehículos Disponibles</p>
          <p className="text-4xl font-black text-green-600 mt-2">{disponibles}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Unidades Vendidas</p>
          <p className="text-4xl font-black text-amber-600 mt-2">{vendidos}</p>
        </div>
      </div>

      {/* REVISIÓN RÁPIDA DE STOCK */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Últimos movimientos de stock</h2>
        {vehicles.length === 0 ? (
          <p className="text-gray-500">No hay registros para mostrar.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {vehicles.slice(-5).reverse().map((car) => (
              <div key={car.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{car.marca} {car.modelo}</p>
                  <p className="text-sm text-gray-500">Valor de lista: {car.precio}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  car.estado === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {car.estado}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}