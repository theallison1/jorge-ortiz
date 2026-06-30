"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { 
  FaChartLine, 
  FaCar, 
  FaUsers, 
  FaFileInvoiceDollar, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaDownload
} from "react-icons/fa";

export default function SistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 📱 Estados para la instalación de la PWA
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

const handleLogout = () => {
    // 1. Borramos la cookie asegurando que expire con una fecha vieja
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    
    // 2. Doble verificación: limpiamos por las dudas si quedó en otra ruta
    document.cookie = "token=; path=/(sistema); expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    // 3. Forzamos un redireccionamiento duro del navegador (esto destruye la caché de Next.js)
    window.location.href = '/login';
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Muestra el prompt nativo de instalación
    deferredPrompt.prompt();
    
    // Espera la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Usuario eligió instalar: ${outcome}`);
    
    // Limpiamos el estado porque el prompt ya se usó
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: FaChartLine },
    { name: "Vehículos", href: "/vehicles", icon: FaCar },
    { name: "Clientes", href: "/clients", icon: FaUsers },
    { name: "Ventas", href: "/sales", icon: FaFileInvoiceDollar },
    { name: "Ajustes", href: "/settings", icon: FaCog },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-black">
      
      {/* SIDEBAR PARA COMPUTADORA */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo / Nombre Concesionaria */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaCar className="text-blue-500 text-2xl" />
              <span className="font-bold text-xl tracking-wider">ORTIZ_AUTO</span>
            </div>
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

        {/* Sección inferior Sidebar: Instalar + Cerrar Sesión */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {showInstallBtn && (
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg"
            >
              <FaDownload size={20} />
              Instalar App PC
            </button>
          )}

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-950/30 transition-all text-left"
          >
            <FaSignOutAlt size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        
        {/* HEADER RESPONSIVO (Celular) */}
        <header className="bg-white border-b border-gray-200 p-4 flex md:hidden justify-between items-center z-50">
          <div className="flex items-center gap-2">
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
          
          <div className="flex items-center gap-2">
            {/* 📱 Botón de instalar directamente en la barra del Celular */}
            {showInstallBtn && (
              <button 
                onClick={handleInstallClick}
                className="bg-green-600 text-white flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow animate-pulse"
              >
                <FaDownload size={12} />
                Instalar
              </button>
            )}
            <button 
              onClick={handleLogout} 
              className="text-red-500 p-2 focus:outline-none"
              aria-label="Cerrar sesión"
            >
              <FaSignOutAlt size={20} />
            </button>
          </div>
        </header>

        {/* MENÚ DESPLEGABLE MÓVIL */}
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
                    onClick={() => setIsMenuOpen(false)}
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

        {/* Contenido dinámico */}
        <main className="flex-1 overflow-y-auto bg-gray-50 w-full">
          {children}
        </main>
      </div>

    </div>
  );
}