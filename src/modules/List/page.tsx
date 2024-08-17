import ReactPlayer from "react-player";

import { trpc } from "~utils/trpc";

export function Page() {
  const { data } = trpc.getList.useQuery("hello");

  return (
    <>
      <article className="flex flex-col items-center px-8">
        <pre>{JSON.stringify(data, null, 2)}</pre>

        <div className="hidden mt-8 sm:flex sm:justify-center sm:w-screen">
          {data && (
            <ReactPlayer controls url={`https://www.youtube.com/playlist?list=${data.id}`} />
          )}
        </div>
      </article>
    </>
  );
}
