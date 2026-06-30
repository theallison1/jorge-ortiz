"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  FaChartLine, 
  FaCar, 
  FaUsers, 
  FaFileInvoiceDollar, 
  FaCog, 
  FaSignOutAlt 
} from "react-icons/fa";

export default function SistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: FaChartLine },
    { name: "Vehículos", href: "/vehicles", icon: FaCar },
    { name: "Clientes", href: "/clients", icon: FaUsers },
    { name: "Ventas", href: "/sales", icon: FaFileInvoiceDollar },
    { name: "Ajustes", href: "/settings", icon: FaCog },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo / Nombre ERP */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <FaCar className="text-blue-500 text-2xl" />
            <span className="font-bold text-xl tracking-wider">CRUISE_ERP</span>
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

        {/* Botón Salir / Logout */}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Barra superior para móvil (Responsive Header) */}
        <header className="bg-white border-b border-gray-100 p-4 flex md:hidden justify-between items-center">
          <div className="flex items-center gap-2">
            <FaCar className="text-blue-600 text-xl" />
            <span className="font-bold text-lg text-slate-900">CRUISE</span>
          </div>
          {/* Aquí podrías meter un botón de menú hamburguesa para móvil más adelante */}
          <Link href="/login" className="text-red-500">
            <FaSignOutAlt size={20} />
          </Link>
        </header>

        {/* Contenido Dinámico de las Páginas */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

    </div>
  );
}