import Link from "next/link";

type MovieType = {
  id: string;
  title: string;
  release_date: string;
  poster_path: string;
  overview: string;
}

async function fetchPopular() : Promise<MovieType[]> {
    const token = process.env.TMDB_TOKEN;
    const res = await fetch("https://api.themoviedb.org/3/movie/popular", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const data = await res.json();
    return data.results;
}

export default async function Home() {
  const popular = await fetchPopular();
  const img_path = "http://image.tmdb.org/t/p/w185";

  return (
    <div>
      <h2 className="pb-2 mb-2 border-b font-bold text-lg">Popular</h2>
      <div className="flex gap-2 flex-wrap">
            {popular.map(movie => {
                return <div key={movie.id} className="w-[185px] flex flex-col mb-4 items-center">
                    <Link href={`/detail/${movie.id}`}>
                        <img  
                            className="transition-all hover:scale-105"
                            src={img_path + movie.poster_path}
                            alt={movie.title}
                        />
                    </Link>
                    <b className="d-block text-center">{movie.title}</b>
                    <small>{movie.release_date.split("-")[0]}</small>
                </div>
            })}
      </div>
    </div>
  )
}