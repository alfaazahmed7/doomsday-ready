import type { Movie, CreateMovieData, UpdateMovieData } from '../types/movie';

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

export const createMovie = async (data: CreateMovieData): Promise<Movie> => {
  const res = await fetch(`${baseUrl}/api/movies`, {
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

export const getAllMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${baseUrl}/api/movies`, {
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

export const updateMovie = async (id: string, data: UpdateMovieData): Promise<Movie> => {
  const res = await fetch(`${baseUrl}/api/movies/${id}`, {
    method: 'PATCH',
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

export const getRewatchOrder = async (id: string): Promise<Movie[]> => {
  const res = await fetch(`${baseUrl}/api/movies/${id}/rewatch-order`, {
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