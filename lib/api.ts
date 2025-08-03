'use server';

import { ApiError } from '@/app/types/apiError.type';

const API_URL = 'http://localhost:3000'; // NestJS portja

type Result<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<Result<T>> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    cache: 'no-store',
  });

  if (!res.ok) return { ok: false, error: await res.json() };

  return { ok: true, data: await res.json() };
}
