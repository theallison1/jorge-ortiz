'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 text-black w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO / NOMBRE */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/dashboard" className="text-xl font-black text-blue-600 tracking-tight">
              ORTIZ AUTO
            </Link>
          </div>

          {/* BOTONES PARA COMPUTADORA (Ocultos en celular) */}
          <div className="hidden sm:flex sm:space-x-8">
            <Link href="/dashboard" className="border-b-2 border-transparent hover:border-blue-500 px-1 pt-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition">
              Dashboard
            </Link>
            <Link href="/vehicles" className="border-b-2 border-transparent hover:border-blue-500 px-1 pt-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition">
              Catálogo de Stock
            </Link>
          </div>

          {/* BOTÓN HAMBURGUESA PARA CELULARES */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú</span>
              {/* Icono de Hamburguesa (☰) cuando está cerrado, o Cruz (X) cuando está abierto */}
              {!isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE EN CELULARES (Solo se ve si isOpen es true) */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden bg-gray-50 border-t border-gray-100`} id="mobile-menu">
        <div className="pt-2 pb-4 space-y-1 px-4">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block pl-3 pr-4 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/vehicles"
            onClick={() => setIsOpen(false)}
            className="block pl-3 pr-4 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
          >
            Catálogo de Stock
          </Link>
        </div>
      </div>
    </nav>
  );
}