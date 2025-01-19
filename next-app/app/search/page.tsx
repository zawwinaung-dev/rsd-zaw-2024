import MovieList from "@/components/movie-list";

type MovieType = {
    id: string;
    title: string;
    release_date: string;
    poster_path: string;
    overview: string;
};

async function searchMovies(q: string): Promise<MovieType[]> {
	const token = process.env.TMDB_TOKEN;
	const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${q}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    const data = await res.json();
    return data.results;
}


export default async function Search({
    searchParams,
}: {
  searchParams: Promise<{q: string}>
}) {
    const { q } = await searchParams;
    const movies = await searchMovies(q);

    return <div>
      <h2 className="pb-2 mb-2 border-b font-bold text-lg">Search: {q}</h2>
      <MovieList movies={movies} />
    </div>
  }