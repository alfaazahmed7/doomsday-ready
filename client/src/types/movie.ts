export interface Movie {
  id: string;
  title: string;
  releaseYear?: number;
  watched: boolean;
  prerequisiteIds?: string[];
}

export interface MovieStats {
  totalMovies: number;
  totalWatched: number;
}