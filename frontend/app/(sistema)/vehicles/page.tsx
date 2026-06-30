'use client';
import { useState, useEffect } from 'react';

interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  version?: string;
  anio: number;
  kilometros: string;
  precio: string;
  estado: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [version, setVersion] = useState('');
  const [anio, setAnio] = useState(2026);
  const [kilometros, setKilometros] = useState('');
  const [precio, setPrecio] = useState('');

  const URL_BACKEND = 'http://localhost:4000/api/vehicles';

  const fetchVehicles = async () => {
    try {
      const res = await fetch(URL_BACKEND);
      if (!res.ok) throw new Error("Error en el servidor");
      const data = await res.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marca || !modelo || !precio) return alert("Marca, Modelo y Precio son obligatorios");

    try {
      const res = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marca, modelo, version, anio, kilometros, precio }),
      });

      if (res.ok) {
        setMarca('');
        setModelo('');
        setVersion('');
        setAnio(2026);
        setKilometros('');
        setPrecio('');
        fetchVehicles();
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  // 🟢 FUNCIÓN PARA MARCAR COMO VENDIDO (PUT)
  const handleMarcarVendido = async (car: Vehicle) => {
    try {
      const res = await fetch(`${URL_BACKEND}/${car.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...car, estado: 'Vendido' }), // Cambiamos el estado
      });

      if (res.ok) fetchVehicles(); // Refresca la lista
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  // 🔴 FUNCIÓN PARA ELIMINAR (DELETE)
  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que querés eliminar este vehículo del sistema?")) return;

    try {
      const res = await fetch(`${URL_BACKEND}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchVehicles(); // Refresca la lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  if (loading) return <div className="p-6 text-center font-semibold">Cargando catálogo... 🚗</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
      {/* FORMULARIO */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 h-fit">
        <h2 className="text-xl font-bold mb-4">Registrar Vehículo</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Marca *</label>
            <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} className="w-full p-2 border rounded bg-gray-50" placeholder="Ej: Toyota" />
          </div>
          <div>
            <label className="block text-sm font-medium">Modelo *</label>
            <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} className="w-full p-2 border rounded bg-gray-50" placeholder="Ej: Hilux" />
          </div>
          <div>
            <label className="block text-sm font-medium">Versión</label>
            <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="w-full p-2 border rounded bg-gray-50" placeholder="Ej: SRX" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium">Año</label>
              <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className="w-full p-2 border rounded bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium">KM</label>
              <input type="text" value={kilometros} onChange={(e) => setKilometros(e.target.value)} className="w-full p-2 border rounded bg-gray-50" placeholder="Ej: 45.000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Precio *</label>
            <input type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full p-2 border rounded bg-gray-50" placeholder="Ej: $30.000.000" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition mt-4">
            Guardar Vehículo
          </button>
        </form>
      </div>

      {/* CATÁLOGO */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6">Catálogo de Vehículos</h1>
        {vehicles.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm">
            <p className="text-yellow-700 font-medium">No hay vehículos registrados en Render.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map((car) => (
              <div key={car.id} className="border border-gray-200 p-5 rounded-xl shadow-md bg-white flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-900">{car.marca} {car.modelo}</h2>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      car.estado === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {car.estado}
                    </span>
                  </div>
                  {car.version && <p className="text-sm text-gray-500 italic mb-2">{car.version}</p>}
                  <p className="text-gray-600 text-sm">Año: {car.anio} | KM: {car.kilometros}</p>
                  <p className="text-2xl font-black text-green-600 mt-3">{car.precio}</p>
                </div>

                {/* ACCIONES DE CONTROL */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
                  {car.estado === 'Disponible' ? (
                    <button onClick={() => handleMarcarVendido(car)} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs py-2 px-3 rounded-md transition">
                      💰 Marcar Vendido
                    </button>
                  ) : (
                    <button disabled className="bg-gray-200 text-gray-400 font-semibold text-xs py-2 px-3 rounded-md cursor-not-allowed">
                      🤝 ¡Vendido!
                    </button>
                  )}
                  <button onClick={() => handleEliminar(car.id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs py-2 px-3 rounded-md transition border border-red-200">
                    🗑️ Eliminar
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}