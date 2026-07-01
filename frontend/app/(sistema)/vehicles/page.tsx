'use client';
import { useState, useEffect } from 'react';
import { FaCar, FaImage, FaTrash } from 'react-icons/fa';

interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  version?: string;
  anio: number;
  kilometros: string;
  precio: string;
  estado: string;
  imagenes?: string[]; 
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del Formulario
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [version, setVersion] = useState('');
  const [anio, setAnio] = useState(2026);
  const [kilometros, setKilometros] = useState('');
  const [precio, setPrecio] = useState('');
  
  // 📸 Ahora guardamos las imágenes codificadas en Base64 aquí
  const [imagenesBase64, setImagenesBase64] = useState<string[]>([]);

  const URL_BACKEND = 'https://jorge-ortiz.onrender.com/api/vehicles';

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

  // 🔄 Manejador para procesar los archivos del móvil/cámara
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Evaluamos cuántas imágenes se pueden agregar sin superar el límite de 4
    const espacioDisponible = 4 - imagenesBase64.length;
    const archivosAProcesar = Array.from(files).slice(0, espacioDisponible);

    archivosAProcesar.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagenesBase64((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file); // Convierte la imagen a Base64
    });
  };

  // 🗑️ Eliminar una foto de la lista de previsualización antes de guardar
  const eliminarFotoSeleccionada = (indexParaEliminar: number) => {
    setImagenesBase64(imagenesBase64.filter((_, index) => index !== indexParaEliminar));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marca || !modelo || !precio) return alert("Marca, Modelo y Precio son obligatorios");

    try {
      const res = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          marca, 
          modelo, 
          version, 
          anio, 
          kilometros, 
          precio,
          imagenes: imagenesBase64 // <-- Enviamos el array con los Base64 generados
        }),
      });

      if (res.ok) {
        setMarca('');
        setModelo('');
        setVersion('');
        setAnio(2026);
        setKilometros('');
        setPrecio('');
        setImagenesBase64([]); // Reseteamos las fotos cargadas
        fetchVehicles();
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  const handleMarcarVendido = async (car: Vehicle) => {
    try {
      const res = await fetch(`${URL_BACKEND}/${car.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...car, estado: 'Vendido' }),
      });

      if (res.ok) fetchVehicles();
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que querés eliminar este vehículo del sistema?")) return;

    try {
      const res = await fetch(`${URL_BACKEND}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchVehicles();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  if (loading) return <div className="p-6 text-center font-semibold text-black">Cargando catálogo... 🚗</div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 text-black">
      
      {/* FORMULARIO DE CARGA */}
      <div className="bg-white p-5 md:p-6 rounded-xl shadow border border-gray-200 h-fit w-full">
        <h2 className="text-xl font-bold mb-4">Registrar Vehículo</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Marca *</label>
            <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} className="w-full p-2 border rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Toyota" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Modelo *</label>
            <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} className="w-full p-2 border rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Hilux" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Versión</label>
            <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="w-full p-2 border rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: SRX 4x4" />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Año</label>
              <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className="w-full p-2 border rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">KM</label>
              <input type="text" value={kilometros} onChange={(e) => setKilometros(e.target.value)} className="w-full p-2 border rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: 45.000" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700">Precio *</label>
            <input type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full p-2 border rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: $30.000.000" />
          </div>

          {/* 📸 NUEVA SECCIÓN DE CARGA MULTIMEDIA DESDE MÓVIL/CÁMARA */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <label className="block text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <FaImage className="text-blue-600" /> Cargar Fotos (Soporta 4)
            </label>
            
            {imagenesBase64.length < 4 ? (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-4 pb-4">
                  <FaImage className="text-gray-400 text-xl mb-1" />
                  <p className="text-xs text-gray-500 font-medium">Toca para abrir cámara o galería</p>
                  <p className="text-[10px] text-gray-400">({imagenesBase64.length} de 4 seleccionadas)</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            ) : (
              <p className="text-xs text-amber-600 font-semibold text-center bg-amber-50 py-1.5 rounded-lg border border-amber-200">
                Límite máximo de 4 fotos alcanzado.
              </p>
            )}

            {/* Previsualización en miniatura con botón de eliminar */}
            {imagenesBase64.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-1">
                {imagenesBase64.map((base64, index) => (
                  <div key={index} className="relative aspect-square w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-100 group">
                    <img src={base64} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => eliminarFotoSeleccionada(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-[10px] hover:bg-red-700 transition"
                    >
                      <FaTrash size={8} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition mt-4 shadow-md">
            Guardar Vehículo
          </button>
        </form>
      </div>

      {/* VISTA DEL CATÁLOGO */}
      <div className="lg:col-span-2 w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center sm:text-left">Catálogo de Vehículos</h1>
        
        {vehicles.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm">
            <p className="text-yellow-700 font-medium">No hay vehículos registrados en Render.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {vehicles.map((car) => (
              <div key={car.id} className="border border-gray-200 rounded-xl shadow-md bg-white flex flex-col justify-between overflow-hidden w-full">
                
                {/* CARRUSEL DE IMÁGENES */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden group">
                  {car.imagenes && car.imagenes.length > 0 ? (
                    <div className="flex overflow-x-auto h-full snap-x snap-mandatory scrollbar-none scroll-smooth">
                      {car.imagenes.map((url, index) => (
                        <div key={index} className="w-full h-full flex-shrink-0 snap-start relative">
                          <img 
                            src={url} 
                            alt={`${car.marca} ${car.modelo} - Foto ${index + 1}`} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {index + 1} / {car.imagenes?.length}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                      <FaCar size={40} className="mb-1" />
                      <span className="text-xs">Sin fotos registradas</span>
                    </div>
                  )}

                  {car.imagenes && car.imagenes.length > 1 && (
                    <div className="absolute inset-x-0 bottom-1 flex justify-center gap-1 pointer-events-none">
                      {car.imagenes.map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-white/60" />
                      ))}
                    </div>
                  )}
                </div>

                {/* DETALLES DEL VEHÍCULO */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h2 className="text-lg font-bold text-gray-950 truncate">{car.marca} {car.modelo}</h2>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 uppercase ${
                        car.estado === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {car.estado}
                      </span>
                    </div>
                    {car.version && <p className="text-xs text-gray-500 italic mb-2 truncate">{car.version}</p>}
                    <p className="text-gray-600 text-xs mt-1">Año: {car.anio} | KM: {car.kilometros}</p>
                    <p className="text-xl font-black text-blue-600 mt-2">{car.precio}</p>
                  </div>

                  {/* ACCIONES DE CONTROL */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
                    {car.estado === 'Disponible' ? (
                      <button onClick={() => handleMarcarVendido(car)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2 px-3 rounded-lg transition active:scale-95 shadow-sm">
                        💰 Vender
                      </button>
                    ) : (
                      <button disabled className="bg-gray-100 text-gray-400 font-bold text-xs py-2 px-3 rounded-lg cursor-not-allowed">
                        🤝 Vendido
                      </button>
                    )}
                    <button onClick={() => handleEliminar(car.id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-2 px-3 rounded-lg transition border border-red-200 active:scale-95">
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
