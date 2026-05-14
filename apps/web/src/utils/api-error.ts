import type { AxiosError } from 'axios';

type MessagePayload = { message?: string | string[] };

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Error inesperado',
): string {
  if (!error || typeof error !== 'object') return fallback;
  const ax = error as AxiosError<MessagePayload>;
  const msg = ax.response?.data?.message;
  if (Array.isArray(msg)) return msg.join('. ');
  if (typeof msg === 'string' && msg.trim()) return msg;
  return fallback;
}
