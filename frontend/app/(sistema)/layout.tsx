"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  FaChartLine, 
  FaCar, 
  FaUsers, 
  FaFileInvoiceDollar, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

export default function SistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: FaChartLine },
    { name: "Vehículos", href: "/vehicles", icon: FaCar },
    { name: "Clientes", href: "/clients", icon: FaUsers },
    { name: "Ventas", href: "/sales", icon: FaFileInvoiceDollar },
    { name: "Ajustes", href: "/settings", icon: FaCog },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-black">
      
      {/* SIDEBAR PARA COMPUTADORA (hidden md:flex lo oculta en celular) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo / Nombre Concesionaria */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <FaCar className="text-blue-500 text-2xl" />
            <span className="font-bold text-xl tracking-wider">ORTIZ_AUTO</span>
          </div>

          {/* Opciones del Menú */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all
                    ${isActive 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/30" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Cierre de Sesión */}
        <div className="p-4 border-t border-slate-800">
          <Link 
            href="/login"
            className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-950/30 transition-all"
          >
            <FaSignOutAlt size={20} />
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        
        {/* HEADER RESPONSIVO (Solo se ve en celular/tablet) */}
        <header className="bg-white border-b border-gray-200 p-4 flex md:hidden justify-between items-center z-50">
          <div className="flex items-center gap-2">
            {/* Botón de Hamburguesa */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-slate-800 p-2 focus:outline-none"
              aria-label="Menú de navegación"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <div className="flex items-center gap-1.5 ml-1">
              <FaCar className="text-blue-600 text-xl" />
              <span className="font-bold text-lg text-slate-900 tracking-wide">ORTIZ</span>
            </div>
          </div>
          
          <Link href="/login" className="text-red-500 p-2">
            <FaSignOutAlt size={20} />
          </Link>
        </header>

        {/* MENÚ DESPLEGABLE MÓVIL (Aparece al tocar la hamburguesa) */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 text-white absolute top-16 left-0 w-full shadow-xl border-t border-slate-800 z-40 transition-all duration-200">
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)} // Cierra el menú al navegar
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all
                      ${isActive 
                        ? "bg-blue-600 text-white" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Contenido dinámico de cada página */}
        <main className="flex-1 overflow-y-auto bg-gray-50 w-full">
          {children}
        </main>
      </div>

    </div>
  );
}