import { PlayIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import Link from "next/link";

type GenresType = {
  id: number;
  name: string;
};

async function fetchGenres(): Promise<GenresType[]> {
  const res = await fetch("https://api.themoviedb.org/3/genre/movie/list", {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });

  const data = await res.json();
  return data.genres;
}

export default async function Sidebar() {
  const genres = await fetchGenres();

  return (
    <aside className="w-[250px] pr-4 border-r flex flex-col gap-1 flex-shrink-0">
      <Button variant="outline" className="font-bold justify-start" asChild>
        <Link href="/">
          <PlayIcon /> All Genres
        </Link>
      </Button>
      {genres.map((genre) => {
        return (
          <Button key={String(genre.id)} variant="outline" className="font-bold justify-start" asChild>
            <Link href={`/genres/${genre.name}/${genre.id}`}> {/* add slash at the start of url */}
              <PlayIcon /> {genre.name}
            </Link>
          </Button>
        );
      })}
    </aside>
  );
}
