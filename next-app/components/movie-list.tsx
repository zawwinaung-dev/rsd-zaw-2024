import Link from "next/link";

type MovieType = {
	id: string;
	title: string;
	release_date: string;
	poster_path: string;
    overview: string;
};

export default async function MovieList({movies} : {movies: MovieType[]}) {
    const img_path = "http://image.tmdb.org/t/p/w185";

	return (
		<div>
            <div className="flex gap-2 flex-wrap">
                {movies.map(movie => {
                    return (
						<div
                            key={movie.id}
							id={movie.id}
							className="w-[185px] flex flex-col mb-4 items-center">
							<Link href={`/detail/${movie.id}`}>
								<img
                                    className="transition-all hover:scale-105"
									src={img_path + movie.poster_path}
									alt={movie.title}
								/>
							</Link>
							<b className="d-block text-center">{movie.title}</b>
							<small>{movie.release_date?.split("-")[0]}</small>
						</div>
					);
                })}
            </div>
		</div>
	);
}