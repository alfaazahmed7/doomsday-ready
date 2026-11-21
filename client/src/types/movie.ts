export interface Movie {
  _id: string;
  title: string;
  releaseYear: number;
  runtime: number;
  prerequisites: MoviePrerequisite[];
  watched: boolean;
}

export interface MoviePrerequisite {
  _id: string;
  title: string;
  releaseYear: number;
  runtime: number;
  watched: boolean;
}

export interface CreateMovieData {
  title: string;
  releaseYear: number;
  runtime: number;
  prerequisites: string[];
}

export interface UpdateMovieData {
  title?: string;
  releaseYear?: number;
  runtime?: number;
  prerequisites?: string[];
  watched?: boolean;
}

export interface MovieStats {
  totalMovies: number;
  totalWatched: number;
  totalUnwatched: number;
}

export interface ApiMovieResponse {
  success: boolean;
  data?: Movie | Movie[];
  error?: {
    code: string;
    message: string;
  };
}
