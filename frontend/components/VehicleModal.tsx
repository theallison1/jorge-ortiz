"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaCamera, FaSave } from "react-icons/fa";

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: any) => void;
  editingVehicle?: any; // Prop opcional para cuando editamos
}

const initialFormState = {
  marca: "",
  modelo: "",
  version: "",
  anio: 2026,
  combustible: "Nafta",
  transmision: "Manual",
  kilometros: "",
  precio: "",
  color: "",
  patente: "",
  descripcion: "",
  estado: "Disponible",
};

export default function VehicleModal({ isOpen, onClose, onSave, editingVehicle }: VehicleModalProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState<string[]>([]);

  // Sincronizar el formulario con el vehículo a editar si existe
  useEffect(() => {
    if (editingVehicle) {
      setFormData(editingVehicle);
      setImages(editingVehicle.images || []);
    } else {
      setFormData(initialFormState);
      setImages([]);
    }
  }, [editingVehicle, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 10 - images.length);
      const newImages = filesArray.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, images });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full flex flex-col shadow-2xl">
        
        {/* Header Dinámico */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-950 text-white">
          <h2 className="text-xl font-bold">
            {editingVehicle ? `Editar: ${editingVehicle.marca} ${editingVehicle.modelo}` : "Añadir Nuevo Vehículo"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* SECCIÓN FOTOS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fotos del Vehículo (Hasta 10)
            </label>
            <div className="grid grid-cols-4 gap-3">
              {images.map((src, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ))}
              {images.length < 10 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <FaCamera className="text-gray-400 text-xl mb-1" />
                  <span className="text-xs text-gray-500">{images.length}/10</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Estado del Vehículo */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado Comercial</label>
              <select value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white outline-none font-semibold">
                <option value="Disponible">🟢 Disponible</option>
                <option value="Reservado">🟡 Reservado</option>
                <option value="Vendido">🔴 Vendido</option>
              </select>
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
              <input type="text" required value={formData.marca} onChange={(e) => setFormData({...formData, marca: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none" />
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
              <input type="text" required value={formData.modelo} onChange={(e) => setFormData({...formData, modelo: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none" />
            </div>

            {/* Versión */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Versión</label>
              <input type="text" value={formData.version} onChange={(e) => setFormData({...formData, version: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none" />
            </div>

            {/* Año */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
              <input type="number" required value={formData.anio} onChange={(e) => setFormData({...formData, anio: parseInt(e.target.value) || 2026})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none" />
            </div>

            {/* Combustible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Combustible</label>
              <select value={formData.combustible} onChange={(e) => setFormData({...formData, combustible: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white outline-none">
                <option value="Nafta">Nafta</option>
                <option value="Diesel">Diesel</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>

            {/* Transmisión */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmisión</label>
              <select value={formData.transmision} onChange={(e) => setFormData({...formData, transmision: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white outline-none">
                <option value="Manual">Manual</option>
                <option value="Automática">Automática</option>
              </select>
            </div>

            {/* Kilómetros */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kilómetros *</label>
              <input type="number" required value={formData.kilometros} onChange={(e) => setFormData({...formData, kilometros: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none" />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
              <input type="text" required value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none" />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none" />
            </div>

            {/* Patente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patente</label>
              <input type="text" value={formData.patente} onChange={(e) => setFormData({...formData, patente: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none" />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea rows={3} value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none resize-none" />
          </div>
          
          {/* Botonera de Acciones */}
          <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md">
              <FaSave /> {editingVehicle ? "Actualizar Cambios" : "Guardar Vehículo"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}