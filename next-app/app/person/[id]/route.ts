type PersonType = {
  id: string;
  name: string;
  gender: string;
};

async function fetchPerson(id: string): Promise<PersonType> {
  const res = await fetch(`https://api.themoviedb.org/3/person/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });

  const data = await res.json();
  return data;
}

export async function GET(request: Request, { params }: {params: Promise<{id: string}>} ) {
    const { id } = await params;
    const person = await fetchPerson(id);

    return Response.json(person);
}
