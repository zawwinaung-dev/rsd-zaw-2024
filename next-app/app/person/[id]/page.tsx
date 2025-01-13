export default async function Person({params, } : { params: Promise<{id : string}>;}) {
    return <div>
      <h2 className="pb-2 mb-2 border-b font-bold text-lg">Person</h2>
      {(await params).id}
    </div>
  }