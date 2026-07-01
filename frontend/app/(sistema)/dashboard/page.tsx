'use client';
import { useState, useEffect } from 'react';
import { FaSearch, FaGlobe, FaTimes, FaChartLine } from 'react-icons/fa';

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
  
  // Estados para el buscador online integrado
  const [busqueda, setBusqueda] = useState('');
  const [urlActiva, setUrlActiva] = useState<string | null>(null);

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

  // Métricas
  const totalStock = vehicles.length;
  const disponibles = vehicles.filter(car => car.estado === 'Disponible').length;
  const vendidos = vehicles.filter(car => car.estado === 'Vendido').length;

  // Renderiza el buscador libre embebido apuntando al mercado automotor argentino
  const buscarEnApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busqueda.trim()) return;
    
    // Usamos el motor incrustable de DuckDuckGo enfocado en precios de Argentina
    const terminoPlataformas = `${busqueda} precio mercadolibre kavak argentina`;
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(terminoPlataformas)}&kae=d&k1=-1&k4=-1 animate=0`;
    setUrlActiva(url);
  };

  if (loading) return <div className="p-6 text-center font-semibold text-black">Calculando métricas... 📈</div>;

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto text-black space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
        Panel de Control - Ortiz Automotores
      </h1>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-6 rounded-xl shadow border border-gray-200">
          <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Total en Stock</p>
          <p className="text-3xl md:text-4xl font-black text-blue-600 mt-2">{totalStock}</p>
        </div>
        
        <div className="bg-white p-5 md:p-6 rounded-xl shadow border border-gray-200">
          <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Vehículos Disponibles</p>
          <p className="text-3xl md:text-4xl font-black text-green-600 mt-2">{disponibles}</p>
        </div>
        
        <div className="bg-white p-5 md:p-6 rounded-xl shadow border border-gray-200 sm:col-span-2 md:col-span-1">
          <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">Unidades Vendidas</p>
          <p className="text-3xl md:text-4xl font-black text-amber-600 mt-2">{vendidos}</p>
        </div>
      </div>

      {/* 🔍 BUSCADOR DE MERCADO ONLINE INTEGRADO (SIN SALIR DE LA APP) */}
      <div className="bg-white p-5 rounded-xl shadow border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <FaChartLine className="text-blue-600" size={16} />
          <h3 className="text-base font-bold text-gray-900">Buscador de Valores de Mercado</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Buscá cotizaciones, competidores y referencias de precios en vivo desde tu propio panel.
        </p>

        <form onSubmit={buscarEnApp} className="flex gap-2 max-w-md mb-4">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej: Hilux 2022 SRX"
            className="flex-1 p-2 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 rounded-xl transition shadow-sm flex items-center gap-1"
          >
            <FaSearch size={10} /> Consultar
          </button>
        </form>

        {/* NAVEGADOR WEB INTERNO */}
        {urlActiva ? (
          <div className="border border-gray-300 rounded-xl overflow-hidden shadow-inner bg-gray-100">
            {/* Barra superior de navegación */}
            <div className="bg-gray-200 px-4 py-2 flex justify-between items-center border-b border-gray-300 text-xs text-gray-600 font-medium">
              <div className="flex items-center gap-2 truncate">
                <FaGlobe className="text-green-600" />
                <span className="truncate bg-white px-2 py-0.5 rounded border border-gray-300 shadow-sm font-mono text-[11px]">
                  Resultados en vivo para: "{busqueda}"
                </span>
              </div>
              <button 
                onClick={() => { setUrlActiva(null); setBusqueda(''); }}
                className="text-red-600 hover:bg-red-100 p-1 rounded-full transition flex items-center justify-center"
              >
                <FaTimes size={14} />
              </button>
            </div>
            
            {/* Iframe que procesa las webs de precios */}
            <div className="w-full h-[550px] bg-white">
              <iframe 
                src={urlActiva} 
                className="w-full h-full border-none"
                title="Explorador de Mercado Online"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-xl py-10 text-center text-xs text-gray-400 font-medium bg-gray-50">
            Ingresá marca, modelo o año arriba para escanear los precios online aquí dentro.
          </div>
        )}
      </div>

      {/* REVISIÓN RÁPIDA DE STOCK */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-200 overflow-hidden">
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
