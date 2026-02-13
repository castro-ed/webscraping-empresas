'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated rings */}
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-gold-500" style={{ animationDuration: '1s' }} />
        <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-t-brown-400" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-4 animate-spin rounded-full border-4 border-transparent border-t-gold-300" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-pulse rounded-full bg-gold-400" />
        </div>
      </div>

      <div className="mt-6 space-y-2 text-center">
        <p className="text-sm font-semibold text-brown-700">
          Buscando empresas...
        </p>
        <p className="text-xs text-warmGray-400">
          Isso pode levar alguns segundos
        </p>
      </div>

      {/* Animated dots */}
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-gold-400"
            style={{
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
