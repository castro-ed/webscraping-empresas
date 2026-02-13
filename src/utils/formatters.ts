/**
 * Sanitiza e formata um número de telefone brasileiro.
 * Remove caracteres não numéricos e formata como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.
 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return raw.trim() || 'N/A';
}

/**
 * Sanitiza strings removendo espaços duplicados e trimando.
 */
export function sanitize(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Formata endereço removendo redundâncias e limpando.
 */
export function formatAddress(raw: string): string {
  const cleaned = sanitize(raw);
  return cleaned || 'N/A';
}

/**
 * Trunca texto para exibição com ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}
