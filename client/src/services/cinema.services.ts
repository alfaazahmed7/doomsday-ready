import type { Cinema } from '../types/cinema';
import type { BookingResult } from '../types/cinema';

const baseUrl = import.meta.env.VITE_API_URL;

if (!baseUrl) {
  throw new Error('VITE_API_URL is not configured');
}

interface BackendError {
  code: string;
  message: string;
}

const parseBackendError = async (res: Response): Promise<BackendError> => {
  try {
    const body = await res.json();
    return {
      code: body.error?.code || 'UNKNOWN_ERROR',
      message: body.error?.message || 'Request failed'
    };
  } catch {
    return {
      code: 'UNKNOWN_ERROR',
      message: `Request failed with status ${res.status}`
    };
  }
};

export const createCinema = async (data: { name: string; bundleSizes: number[] }): Promise<Cinema> => {
  const { name, bundleSizes } = data;

  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error('Cinema name is required.');
  }

  const res = await fetch(`${baseUrl}/api/cinemas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const error = await parseBackendError(res);
    const err: any = new Error(error.message);
    err.status = res.status;
    err.code = error.code;
    throw err;
  }
  const json = await res.json();
  return json.data;
};

export const getAllCinemas = async (): Promise<Cinema[]> => {
  const res = await fetch(`${baseUrl}/api/cinemas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const error = await parseBackendError(res);
    const err: any = new Error(error.message);
    err.status = res.status;
    err.code = error.code;
    throw err;
  }
  const json = await res.json();
  return json.data || [];
};

export const calculateBooking = async (cinemaId: string, groupSize: number): Promise<BookingResult> => {
  const res = await fetch(`${baseUrl}/api/cinemas/${cinemaId}/booking?groupSize=${groupSize}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const error = await parseBackendError(res);
    const err: any = new Error(error.message);
    err.status = res.status;
    err.code = error.code;
    throw err;
  }
  const json = await res.json();
  return json.data || { possible: false, bundles: [], totalBundles: 0, totalSeats: 0 };
};