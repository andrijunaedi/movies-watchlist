// filepath: /Users/andri/Kuliah/s1-sistem-informasi/02/integrasi-aplikasi-enterprise/movies-watchlist/src/routes/api/movies/+server.ts
import { json, type RequestEvent } from '@sveltejs/kit';
import { movies } from '$lib/data/movies';

// GET: Fetch all movies
export function GET() {
  return json(movies);
}

// POST: Add a new movie
export async function POST({ request }: RequestEvent) {
  const newMovie = await request.json();
  newMovie.id = movies.length + 1;
  movies.push(newMovie);
  return json(newMovie);
}