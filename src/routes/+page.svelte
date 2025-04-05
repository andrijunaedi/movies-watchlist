<script lang="ts">
	import { onMount } from 'svelte';
	let movies: any[] = [];
	let filterStatus = 'all';
	let isNewMovie = false;
	let isEditing = false;
	let currentMovie = {
		id: null,
		title: '',
		director: '',
		releaseYear: '',
		poster: '',
		synopsis: '',
		status: 'ingin ditonton',
		rating: 1
	};

	// Fetch movies from the API
	async function fetchMovies() {
		try {
			const res = await fetch('/api/movies');
			if (!res.ok) {
				console.error('Failed to fetch movies:', res.statusText);
				return;
			}
			movies = await res.json();
		} catch (error) {
			console.error('Error fetching movies:', error);
		}
	}

	// Add or update a movie
	async function saveMovie() {
		if (isEditing) {
			await fetch(`/api/movies/${currentMovie.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(currentMovie)
			});
		} else {
			await fetch('/api/movies', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(currentMovie)
			});
		}
		isEditing = false;
		isNewMovie = false;
		resetForm();
		fetchMovies();
	}

	// Delete a movie
	async function deleteMovie(id: number) {
		await fetch(`/api/movies/${id}`, {
			method: 'DELETE'
		});
		fetchMovies();
	}

	// Reset form
	function resetForm() {
		currentMovie = {
			id: null,
			title: '',
			director: '',
			releaseYear: '',
			poster: '',
			synopsis: '',
			status: 'ingin ditonton',
			rating: 1
		};
	}

	// Filter movies by status
	function filteredMovies() {
		if (filterStatus === 'all') return movies;
		return movies.filter((movie) => movie.status === filterStatus);
	}

	onMount(() => {
		fetchMovies();
	});
</script>

<svelte:head>
    <title>Movies Watchlist</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-white">
	<header class="flex items-center justify-between bg-gray-800 p-4">
		<h1 class="text-2xl font-bold">Movies Watchlist</h1>
		<select bind:value={filterStatus} class="rounded bg-gray-700 p-2 text-white">
			<option value="all">All</option>
			<option value="ingin ditonton">Ingin Ditonton</option>
			<option value="sedang ditonton">Sedang Ditonton</option>
			<option value="sudah ditonton">Sudah Ditonton</option>
		</select>
	</header>

	<main class="p-4">
		<!-- Form for Adding/Editing Movies -->
		{#if isEditing || isNewMovie || currentMovie.title !== ''}
			<div class="mb-4 rounded bg-gray-800 p-4">
				<h2 class="mb-2 text-xl font-semibold">{isEditing ? 'Edit Movie' : 'Add New Movie'}</h2>
				<form on:submit|preventDefault={saveMovie}>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<input
							type="text"
							bind:value={currentMovie.title}
							placeholder="Title"
							class="rounded bg-gray-700 p-2 text-white"
							required
						/>
						<input
							type="text"
							bind:value={currentMovie.director}
							placeholder="Director"
							class="rounded bg-gray-700 p-2 text-white"
							required
						/>
						<input
							type="number"
							bind:value={currentMovie.releaseYear}
							placeholder="Release Year"
							class="rounded bg-gray-700 p-2 text-white"
							required
						/>
						<input
							type="text"
							bind:value={currentMovie.poster}
							placeholder="Poster URL"
							class="rounded bg-gray-700 p-2 text-white"
						/>
						<select bind:value={currentMovie.status} class="rounded bg-gray-700 p-2 text-white">
							<option value="ingin ditonton">Ingin Ditonton</option>
							<option value="sedang ditonton">Sedang Ditonton</option>
							<option value="sudah ditonton">Sudah Ditonton</option>
						</select>
						<div class="flex items-center">
							<span class="mr-2 text-white">Rate</span>
							<div class="flex">
								{#each Array(5) as _, index}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<svg
										on:click={() => (currentMovie.rating = index + 1)}
										class="h-6 w-6 cursor-pointer"
										fill={index < currentMovie.rating ? 'yellow' : 'gray'}
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<path
											d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.868 1.516 8.826-7.452-4.02-7.452 4.02 1.516-8.826-6.064-5.868 8.332-1.151z"
										/>
									</svg>
								{/each}
							</div>
						</div>
					</div>
					<textarea
						bind:value={currentMovie.synopsis}
						placeholder="Synopsis"
						class="mt-2 w-full rounded bg-gray-700 p-2 text-white"
					></textarea>
					<div class="mt-2 flex justify-end">
						<button
							type="button"
							on:click={() => {
								isNewMovie = false;
								isEditing = false;
								resetForm();
							}}
							class="mr-2 rounded bg-gray-600 px-4 py-2 text-white">Cancel</button
						>
						<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white"
							>{isEditing ? 'Update' : 'Add'}</button
						>
					</div>
				</form>
			</div>
		{/if}
		{#if !(isEditing || isNewMovie || currentMovie.title !== '')}
			<button
				on:click={() => {
					isNewMovie = !isNewMovie;
					if (isNewMovie) {
						resetForm();
						isEditing = false;
					}
				}}
				class="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
			>
				Add New Movie
			</button>
		{/if}

		<!-- Movies List -->
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#if movies.length === 0}
				<p class="col-span-full text-center text-gray-400">
					No movies found. Add some movies to your watchlist!
				</p>
			{:else}
				{#each filteredMovies() as movie}
					<div class="overflow-hidden rounded bg-gray-800 shadow-lg">
						<img src={movie.poster} alt={movie.title} class="h-92 w-full object-cover" />
						<div class="p-2">
							<h3 class="truncate text-lg font-semibold">{movie.title}</h3>
							<p class="text-sm text-gray-400">{movie.director}</p>
							<p class="text-sm text-gray-400">{movie.releaseYear}</p>
							<p class="text-sm text-gray-400">{movie.synopsis}</p>
							<div class="mt-2 flex items-center justify-between">
								<span class="text-sm text-yellow-400">⭐ {movie.rating}/5</span>
								<span class="rounded bg-blue-500 px-2 py-1 text-xs text-white">
									{movie.status.replace(/\b\w/g, (char: string) => char.toUpperCase())}
								</span>
							</div>
							<div class="mt-5 flex justify-between">
								<button
									on:click={() => {
										isEditing = true;
										currentMovie = { ...movie };
									}}
									class="rounded bg-green-500 px-2 py-1 text-white">Edit</button
								>
								<button
									on:click={() => {
										if (confirm('Are you sure you want to delete this movie?')) {
											deleteMovie(movie.id);
										}
									}}
									class="rounded bg-red-500 px-2 py-1 text-white">Delete</button
								>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</main>

	<footer class="mt-8 bg-gray-800 p-4 text-center text-gray-400">
		<p>&copy; {new Date().getFullYear()} Andri Junaedi. Developed with passion.</p>
	</footer>
</div>
