'use client';
import { useState, useEffect } from 'react';
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa';

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
  
  // Estado para el comparador online
  const [busqueda, setBusqueda] = useState('');

  const URL_BACKEND = 'https://jorge-ortiz.onrender.com/api/vehicles';

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

  // Enlaces dinámicos para el comparador de precios (reemplaza espacios por guiones para ML)
  const urlMercadoLibre = `https://autos.mercadolibre.com.ar/${busqueda.trim().replace(/ /g, '-')}`;
  const urlKavak = `https://www.kavak.com/ar/autos-usados?q=${encodeURIComponent(busqueda)}`;

  if (loading) return <div className="p-6 text-center font-semibold text-black">Calculando métricas... 📈</div>;

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto text-black">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Panel de Control - Ortiz Automotores
      </h1>

      {/* TARJETAS DE MÉTRICAS RESPONSIVAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white p-5 md:p-6 rounded-xl shadow border border-gray-200 w-full">
          <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Total en Stock</p>
          <p className="text-3xl md:text-4xl font-black text-blue-600 mt-2">{totalStock}</p>
        </div>
        
        <div className="bg-white p-5 md:p-6 rounded-xl shadow border border-gray-200 w-full">
          <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Vehículos Disponibles</p>
          <p className="text-3xl md:text-4xl font-black text-green-600 mt-2">{disponibles}</p>
        </div>
        
        <div className="bg-white p-5 md:p-6 rounded-xl shadow border border-gray-200 w-full sm:col-span-2 md:col-span-1">
          <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Unidades Vendidas</p>
          <p className="text-3xl md:text-4xl font-black text-amber-600 mt-2">{vendidos}</p>
        </div>
      </div>

      {/* 🔍 COMPARADOR DE PRECIOS ONLINE */}
      <div className="bg-white p-5 rounded-xl shadow border border-gray-200 w-full mb-6 text-black">
        <div className="flex items-center gap-2 mb-2">
          <FaSearch className="text-blue-600" size={16} />
          <h3 className="text-base font-bold text-gray-900">Comparador de Precios Online</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Escribí una marca o modelo para contrastar y tasar tus valores con el mercado en tiempo real.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="sm:col-span-1">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej: Toyota Hilux 2021"
              className="w-full p-2 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
            />
          </div>
          
          <div className="sm:col-span-2 grid grid-cols-2 gap-2">
            <a
              href={busqueda ? urlMercadoLibre : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-1.5 font-bold text-xs py-2 px-3 rounded-xl border transition text-center ${
                busqueda 
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-yellow-500' 
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
              onClick={(e) => !busqueda && e.preventDefault()}
            >
              <span>MercadoLibre 🟡</span>
              <FaExternalLinkAlt size={10} />
            </a>

            <a
              href={busqueda ? urlKavak : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-1.5 font-bold text-xs py-2 px-3 rounded-xl border transition text-center ${
                busqueda 
                  ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-950' 
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
              onClick={(e) => !busqueda && e.preventDefault()}
            >
              <span>Kavak 🪙</span>
              <FaExternalLinkAlt size={10} />
            </a>
          </div>
        </div>
      </div>

      {/* REVISIÓN RÁPIDA DE STOCK RESPONSIVA */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-200 w-full overflow-hidden">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-center sm:text-left">Últimos movimientos de stock</h2>
        {vehicles.length === 0 ? (
          <p className="text-gray-500 text-sm text-center sm:text-left">No hay registros para mostrar.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {vehicles.slice(-5).reverse().map((car) => (
              <div key={car.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="w-full sm:w-auto">
                  <p className="font-semibold text-gray-900 text-base">{car.marca} {car.modelo}</p>
                  <p className="text-xs md:text-sm text-gray-500">Valor de lista: {car.precio}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full self-start sm:self-auto ${
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
