'use client';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="relative overflow-hidden border-b border-gold-200/30 bg-gradient-to-r from-brown-900 via-brown-800 to-brown-900">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gold-400 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-gold-500 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Logo icon */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg shadow-gold-500/20 overflow-hidden">
            <Image
              src="/images/suporgi_logo.png"
              alt="Suporgi Logo"
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Suporgi
            </h1>
            <p className="text-xs text-gold-300/80 sm:text-sm">
              Prospecção Inteligente
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-brown-700/50 px-4 py-2 backdrop-blur-sm sm:flex">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-warmGray-300">
            Sistema Online
          </span>
        </div>
      </div>
    </header>
  );
}
