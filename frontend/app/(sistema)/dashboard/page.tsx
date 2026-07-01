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
  
  // Estados para el buscador de mercado libre de errores
  const [busqueda, setBusqueda] = useState('');
  const [resultadosOnline, setResultadosOnline] = useState<MarketVehicle[]>([]);
  const [buscandoOnline, setBuscandoOnline] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);

  const URL_BACKEND_VEHICLES = 'https://jorge-ortiz.onrender.com/api/vehicles';

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(URL_BACKEND_VEHICLES);
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

  // 🔎 ESCANEO DIRECTO AL CLIENTE (Bye bye bloqueos de Render o errores 403)
  const buscarVehiculosMercado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!busqueda.trim()) return;

    setBuscandoOnline(true);
    setErrorBusqueda(null);

    try {
      // Forzamos la consulta directa a la API por categoría Autos (MLA1743)
      const urlApi = `https://api.mercadolibre.com/sites/MLA/search?category=MLA1743&q=${encodeURIComponent(busqueda)}&limit=6`;
      
      const respuesta = await fetch(urlApi);
      if (!respuesta.ok) throw new Error();
      const data = await respuesta.json();

      if (data.results && data.results.length > 0) {
        const mapeado: MarketVehicle[] = data.results.map((item: any) => {
          // Escalamos la foto a máxima resolución
          let fotoUrl = item.thumbnail || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80';
          fotoUrl = fotoUrl.replace('-I.jpg', '-O.jpg').replace('-V.jpg', '-O.jpg');

          return {
            id: item.id || `ml-${Math.random()}`,
            titulo: item.title,
            precio: new Intl.NumberFormat('es-AR', {
              style: 'currency',
              currency: 'ARS',
              maximumFractionDigits: 0
            }).format(item.price || 0),
            origen: item.address?.state_name || 'Argentina',
            imagen: fotoUrl,
            enlace: item.permalink
          };
        });
        
        setResultadosOnline(mapeado);
      } else {
        // Fallback dinámico si la API no devuelve coincidencias directas
        setResultadosOnline([
          {
            id: 'fallback-direct',
            titulo: `Ver publicaciones en la web de: ${busqueda}`,
            precio: '$ 0',
            origen: 'MercadoLibre 🚗',
            imagen: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
            enlace: `https://autos.mercadolibre.com.ar/${encodeURIComponent(busqueda)}`
          }
        ]);
      }
    } catch (error) {
      console.error("Error al buscar en el mercado:", error);
      // Fallback seguro por si se cae la red o el fetch falla por completo
      setResultadosOnline([
        {
          id: 'fallback-error',
          titulo: `Buscar de forma directa en la web: ${busqueda}`,
          precio: '$ 0',
          origen: 'Enlace Auxiliar',
          imagen: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
          enlace: `https://autos.mercadolibre.com.ar/${encodeURIComponent(busqueda)}`
        }
      ]);
    } finally {
      setBuscandoOnline(false);
    }
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

      {/* 🔍 COMPARADOR EN VIVO REAL */}
      <div className="bg-white p-5 rounded-xl shadow border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <FaCar className="text-blue-600" size={18} />
          <h3 className="text-base font-bold text-gray-900">Buscar Vehículos Similares en el Mercado</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Fotos y cotizaciones directas de la red. Al presionar la imagen se abrirá el sitio original de la publicación.
        </p>

        <form onSubmit={buscarVehiculosMercado} className="flex gap-2 max-w-xl mb-6">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej: Fiat Palio 2017"
            className="flex-1 p-2.5 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm transition shadow-inner"
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            <FaSearch size={11} /> Escanear Precios
          </button>
        </form>

        {/* ESTADOS */}
        {buscandoOnline && (
          <div className="text-center py-12 text-sm font-semibold text-gray-600 animate-pulse">
            Buscando imágenes y tasaciones en tiempo real... 🔍
          </div>
        )}

        {errorBusqueda && (
          <div className="text-center py-8 text-sm font-medium text-amber-600 bg-amber-50 rounded-xl border border-amber-200">
            {errorBusqueda}
          </div>
        )}

        {/* CONTENEDOR DE TARJETAS DE AUTOS REALES */}
        {!buscandoOnline && resultadosOnline.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {resultadosOnline.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white flex flex-col justify-between hover:shadow-md transition">
                
                {/* Imagen del auto real */}
                <a href={item.enlace} target="_blank" rel="noopener noreferrer" className="relative group block aspect-video w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={item.imagen} 
                    alt={item.titulo} 
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                    Ir al sitio de publicación <FaExternalLinkAlt size={10} />
                  </div>
                </a>

                {/* Datos del Vehículo Extraído */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      📍 {item.origen}
                    </span>
                    <h4 className="font-semibold text-xs md:text-sm text-gray-900 mt-1.5 line-clamp-2 min-h-[32px]">{item.titulo}</h4>
                  </div>
                  <p className="text-base font-black text-gray-950 mt-1">
                    {item.precio !== '$ 0' ? item.precio : 'Ver Valor en Link'}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ESTADO VACÍO */}
        {!buscandoOnline && resultadosOnline.length === 0 && !errorBusqueda && (
          <div className="border border-dashed border-gray-300 rounded-xl py-12 text-center text-xs text-gray-40
