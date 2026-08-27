import { Observable, firstValueFrom } from 'rxjs';

export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export async function request<T>(observable: Observable<T>, fallback: string): Promise<T> {
  try {
    return await firstValueFrom(observable);
  } catch (error) {
    throw new Error(`${fallback} ${errorMessage(error, 'Unknown API error.')}`);
  }
}
