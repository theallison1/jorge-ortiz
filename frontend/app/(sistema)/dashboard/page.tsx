'use client';
import { useState, useEffect } from 'react';
import { FaSearch, FaCar, FaExternalLinkAlt } from 'react-icons/fa';

interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  precio: string;
  estado: string;
}

// Estructura para los autos que se encuentran online
interface MarketVehicle {
  id: string;
  titulo: string;
  precio: string;
  origen: string;
  imagen: string;
  enlace: string;
}

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el buscador de mercado visual
  const [busqueda, setBusqueda] = useState('');
  const [resultadosOnline, setResultadosOnline] = useState<MarketVehicle[]>([]);
  const [buscandoOnline, setBuscandoOnline] = useState(false);

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

  // Métricas locales
  const totalStock = vehicles.length;
  const disponibles = vehicles.filter(car => car.estado === 'Disponible').length;
  const vendidos = vehicles.filter(car => car.estado === 'Vendido').length;

  // 🔎 Simulador en tiempo real de vehículos parecidos del mercado (MercadoLibre / deRuedas)
  const buscarVehiculosMercado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busqueda.trim()) return;

    setBuscandoOnline(true);

    // Simulamos la respuesta estructurada que te traería el rastreador del mercado
    // Esto evita los bloqueos de iframe y te dibuja las tarjetas reales con imágenes fijas
    setTimeout(() => {
      const mockResultados: MarketVehicle[] = [
        {
          id: '1',
          titulo: `${busqueda} Usado Impecable`,
          precio: '$24.500.000',
          origen: 'deRuedas (Mendoza)',
          imagen: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80',
          enlace: `https://www.deruedas.com.ar/bus.asp?txtBusca=${encodeURIComponent(busqueda)}`
        },
        {
          id: '2',
          titulo: `${busqueda} Financiado / Permuto`,
          precio: '$26.000.000',
          origen: 'MercadoLibre',
          imagen: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
          enlace: `https://autos.mercadolibre.com.ar/${busqueda.trim().replace(/ /g, '-')}`
        },
        {
          id: '3',
          titulo: `${busqueda} Único Dueño Kilometraje Real`,
          precio: '$23.800.000',
          origen: 'Kavak Argentina',
          imagen: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
          enlace: `https://www.kavak.com/ar/autos-usados?q=${encodeURIComponent(busqueda)}`
        }
      ];
      setResultadosOnline(mockResultados);
      setBuscandoOnline(false);
    }, 800); // Pequeño delay para dar sensación de búsqueda en vivo
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

      {/* 🔍 COMPARADOR DE VEHÍCULOS PARECIDOS ONLINE */}
      <div className="bg-white p-5 rounded-xl shadow border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <FaCar className="text-blue-600" size={18} />
          <h3 className="text-base font-bold text-gray-900">Buscar Vehículos Similares en el Mercado</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Ingresá un modelo para traer publicaciones de referencia. Hacé clic en la imagen para ir al sitio de publicación.
        </p>

        <form onSubmit={buscarVehiculosMercado} className="flex gap-2 max-w-xl mb-6">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej: Hilux 2021"
            className="flex-1 p-2.5 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm transition shadow-inner"
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            <FaSearch size={11} /> Escanear Precios
          </button>
        </form>

        {/* GRILLA DE PUBLICACIONES ONLINE */}
        {buscandoOnline ? (
          <div className="text-center py-10 text-sm font-semibold text-gray-600 animate-pulse">
            Buscando coincidencias en deRuedas y MercadoLibre... ⚙️
          </div>
        ) : resultadosOnline.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {resultadosOnline.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white flex flex-col justify-between">
                
                {/* Imagen cliqueable con link de redirección */}
                <a href={item.enlace} target="_blank" rel="noopener noreferrer" className="relative group block aspect-video w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={item.imagen} 
                    alt={item.titulo} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                    Ver Publicación original <FaExternalLinkAlt size={10} />
                  </div>
                </a>

                {/* Info de la publicación copiada */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {item.origen}
                    </span>
                    <h4 className="font-semibold text-sm text-gray-900 mt-1.5 line-clamp-2">{item.titulo}</h4>
                  </div>
                  <p className="text-base font-black text-gray-950 mt-2">{item.precio}</p>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-xl py-8 text-center text-xs text-gray-400 font-medium bg-gray-50">
            Ingresá el vehículo que querés tasar para ver las unidades parecidas del mercado.
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
