import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  authSchema,
  GenreDetail,
  genreDetailSchema,
  healthcheckSchema,
  MovieDetail,
  movieDetailSchema,
  MoviesByGenre,
  moviesByGenreSechma,
  MoviesResponse,
  moviesResponseSchema,
  MovieTitlesResponse,
  movieTitlesResponseSchema,
} from '../validator/validators';

export const MOVIES_API_BASE_URL = new InjectionToken<string>(
  'MOVIES_API_BASE_URL'
);

@Injectable({
  providedIn: 'root',
})
export class MoviesDataAccessService {
  private http = inject(HttpClient);
  private API_BASE_URL = inject(MOVIES_API_BASE_URL);

  getToken(): Observable<{ token: string }> {
    return this.http.get(`${this.API_BASE_URL}/auth/token`).pipe(
      map((resp) => {
        const validationResult = authSchema.safeParse(resp);
        if (!validationResult.success) {
          // Handle validation errors
          throw new Error('Invalid response format');
        }
        return { token: validationResult.data.token };
      })
    );
  }

  healthcheck(): Observable<{ contentful: boolean }> {
    const finalUrl = `${this.API_BASE_URL}/healthcheck`;
    return this.http.get(finalUrl.toString()).pipe(
      map((resp) => {
        const validationResult = healthcheckSchema.safeParse(resp);
        if (!validationResult.success) {
          return { contentful: false };
        }
        return { contentful: validationResult.data.contentful };
      })
    );
  }

  getMoviesByGender({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Observable<MoviesByGenre> {
    const finalUrl = `${this.API_BASE_URL}/genres/movies?limit=${
      limit ? limit : ''
    }&page=${page ? page : ''}`;
    return this.http.get(finalUrl.toString()).pipe(
      map((resp) => {
        const validationResult = moviesByGenreSechma.safeParse(resp);
        if (!validationResult.success) {
          // Handle validation errors
          throw new Error('Invalid response format');
        }
        return validationResult.data;
      })
    );
  }

  getMovies({
    page,
    limit,
    search,
    genre,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    genre?: string;
  }): Observable<MoviesResponse> {
    const finalUrl = `${this.API_BASE_URL}/movies?limit=${
      limit ? limit : ''
    }&page=${page ? page : ''}&search=${search ? search : ''}&genre=${
      genre ? genre : ''
    }`;
    return this.http.get(finalUrl.toString()).pipe(
      map((resp) => {
        const validationResult = moviesResponseSchema.safeParse(resp);
        if (!validationResult.success) {
          // Handle validation errors
          throw new Error('Invalid response format');
        }
        return validationResult.data;
      })
    );
  }

  getMovieDetail({ id }: { id: string }): Observable<MovieDetail> {
    const finalUrl = `${this.API_BASE_URL}/movies/${id}`;
    return this.http.get(finalUrl.toString()).pipe(
      map((resp) => {
        const validationResult = movieDetailSchema.safeParse(resp);
        if (!validationResult.success) {
          // Handle validation errors
          throw new Error('Invalid response format');
        }
        return validationResult.data;
      })
    );
  }

  getMovieTitles({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Observable<MovieTitlesResponse> {
    const finalUrl = `${this.API_BASE_URL}/movies?limit=${limit}&page=${page}`;
    return this.http.get(finalUrl.toString()).pipe(
      map((resp) => {
        const validationResult = movieTitlesResponseSchema.safeParse(resp);
        if (!validationResult.success) {
          // Handle validation errors
          throw new Error('Invalid response format');
        }
        return validationResult.data;
      })
    );
  }

  getMovieGenreDetail({ id }: { id: string }): Observable<GenreDetail> {
    const finalUrl = `${this.API_BASE_URL}/movies/genres/${id}`;
    return this.http.get(finalUrl.toString()).pipe(
      map((resp) => {
        const validationResult = genreDetailSchema.safeParse(resp);
        if (!validationResult.success) {
          // Handle validation errors
          throw new Error('Invalid response format');
        }
        return validationResult.data;
      })
    );
  }
}
