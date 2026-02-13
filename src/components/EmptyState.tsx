'use client';

interface EmptyStateProps {
  hasSearched: boolean;
}

export default function EmptyState({ hasSearched }: EmptyStateProps) {
  if (hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-warmGray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-10 w-10 text-warmGray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-brown-700">
          Nenhum resultado encontrado
        </h3>
        <p className="mt-1 max-w-sm text-center text-sm text-warmGray-400">
          Tente ajustar o termo de busca ou a localidade para encontrar mais
          empresas.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-gold-100 to-gold-200/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-12 w-12 text-gold-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
            />
          </svg>
        </div>
        {/* Floating particles */}
        <div className="absolute -right-1 -top-1 h-3 w-3 animate-bounce rounded-full bg-gold-400" style={{ animationDelay: '0s' }} />
        <div className="absolute -left-2 top-4 h-2 w-2 animate-bounce rounded-full bg-brown-300" style={{ animationDelay: '0.3s' }} />
        <div className="absolute -bottom-1 right-2 h-2.5 w-2.5 animate-bounce rounded-full bg-gold-300" style={{ animationDelay: '0.6s' }} />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-brown-700">
        Comece sua prospecção
      </h3>
      <p className="mt-1 max-w-sm text-center text-sm text-warmGray-400">
        Digite o segmento que procura e a cidade para encontrar empresas com
        nome, endereço e telefone.
      </p>
    </div>
  );
}
