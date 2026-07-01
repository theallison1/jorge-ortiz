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

  // Función interna para procesar y limpiar los datos que vienen de MercadoLibre
  const procesarResultadosML = (results: any[]) => {
    const mapeado: MarketVehicle[] = results.map((item: any) => {
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
  };
const buscarVehiculosMercado = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!busqueda.trim()) return;

  setBuscandoOnline(true);
  setErrorBusqueda(null);
  setResultadosOnline([]);

  try {
    const respuesta = await fetch(
      `https://jorge-ortiz.onrender.com/api/mercado?q=${encodeURIComponent(busqueda)}`
    );

    if (!respuesta.ok) {
      throw new Error("Error al consultar el servidor.");
    }

    const data = await respuesta.json();

    if (data.results && data.results.length > 0) {
      procesarResultadosML(data.results);
    } else {
      setErrorBusqueda("No se encontraron publicaciones.");
    }
  } catch (error) {
    console.error(error);
    setErrorBusqueda("No se pudo conectar con el servidor.");
  } finally {
    setBuscandoOnline(false);
  }
};
  
