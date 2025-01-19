import MovieList from "@/components/movie-list";

type MovieType = {
    id: string;
    title: string;
    release_date: string;
    poster_path: string;
    overview: string;
};

async function fetchByGenres(id: string): Promise<MovieType[]> {
    const token = process.env.TMDB_TOKEN;
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    const data = await res.json();
    return data.results;
}

export default async function Genres({
    params,
}: {
    params: Promise<{id: string, name: string}>;
}) {
    const { id, name } = await params;
    const movies = await fetchByGenres(id);

    return (
        <div>
            <h2 className="pb-2 mb-4 border-b font-bold text-lg">{name}</h2>
            <MovieList movies={movies}/>
        </div>
    );
}