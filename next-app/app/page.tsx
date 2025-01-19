import MovieList from "@/components/movie-list";
import Link from "next/link";

type MovieType = {
	id: string;
	title: string;
	release_date: string;
	poster_path: string;
    overview: string;
};

async function fetchPopular(): Promise<MovieType[]> {
	const token = process.env.TMDB_TOKEN;
	const res = await fetch("https://api.themoviedb.org/3/movie/popular", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    const data = await res.json();
    return data.results;
}

async function fetchTrending(): Promise<MovieType[]> {
	const token = process.env.TMDB_TOKEN;
	const res = await fetch("https://api.themoviedb.org/3/trending/movie/day", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    const data = await res.json();
    return data.results;
}

export default async function Home() {
    const popular = await fetchPopular();
    const trending = await fetchTrending();

	return (
		<div>
			<h2 className="pb-2 mb-4 border-b font-bold text-lg">Popular</h2>
      <MovieList movies={popular}/>

      <h2 className="pb-2 mt-4 border-b font-bold text-lg">Trending</h2>
      <MovieList movies={trending}/>
		</div>
	);
}