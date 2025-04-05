import { json, type RequestEvent } from '@sveltejs/kit';
import { movies } from '$lib/data/movies';

// GET: Fetch a movie by ID
export function GET({ params }: RequestEvent) {
	const id = params.id ? parseInt(params.id) : NaN;
	const movie = movies.find((movie) => movie.id === id);
	if (!movie) {
		return json({ message: 'Movie not found' }, { status: 404 });
	}
	return json(movie);
}

// PUT: Update a movie by ID
export async function PUT({ params, request }: RequestEvent) {
	const id = params.id ? parseInt(params.id) : NaN;
	const updatedMovie = await request.json();
    
	const movieIndex = movies.findIndex((movie) => movie.id === id);

	if (movieIndex === -1) {
		return json({ message: 'Movie not found' }, { status: 404 });
	}

	movies[movieIndex] = { ...movies[movieIndex], ...updatedMovie };
	return json(movies[movieIndex]);
}

// DELETE: Remove a movie by ID
export async function DELETE({ params }: RequestEvent) {
	const id = params.id ? parseInt(params.id) : NaN;
	const movieIndex = movies.findIndex((movie) => movie.id === id);

	if (movieIndex === -1) {
		return json({ message: 'Movie not found' }, { status: 404 });
	}

	movies.splice(movieIndex, 1);
	return json({ success: true });
}
