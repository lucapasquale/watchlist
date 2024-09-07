import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";
import { Skeleton } from "@ui/components/ui/skeleton";

import { UserViewDocument } from "~common/graphql-types";
import { Route } from "~routes/u/$userID.lazy";

import { UserInfo } from "./user-info";
import { UserPlaylists } from "./user-playlists";

export function Page() {
  const { userID } = Route.useParams();

  const { loading, data } = useQuery(UserViewDocument, {
    variables: { userID },
  });

  if (loading || !data) {
    return (
      <main className="grid items-start grid-cols-1 xl:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
        <section className="flex flex-col gap-4">
          <Skeleton className="h-[154px]" />
        </section>

        <section className="w-full h-[975px] overflow-y-scroll flex flex-col gap-2">
          <Skeleton className="h-[98px] bg-card flex-none rounded-xl" />
          <Skeleton className="h-[98px] bg-card flex-none rounded-xl" />
          <Skeleton className="h-[98px] bg-card flex-none rounded-xl" />
        </section>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>watchlist • {data.user.name}</title>
      </Helmet>

      <main className="grid items-start grid-cols-1 xl:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
        <UserInfo user={data.user} />

        <UserPlaylists user={data.user} />
      </main>
    </>
  );
}
