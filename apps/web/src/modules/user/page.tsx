import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";

import { UserViewDocument } from "~common/graphql-types.js";
import { useCurrentUser } from "~common/providers/current-user-provider.js";
import { Route } from "~routes/u/$userID.js";

import { UserInfo } from "./user-info/index.js";
import { UserPlaylists } from "./user-playlists/index.js";

export function Page() {
  const { userID } = Route.useParams();
  const { user: currentUser } = useCurrentUser();

  const { loading, data } = useQuery(UserViewDocument, {
    variables: { userID },
  });

  if (loading || !data) {
    return (
      <main className="my-4 grid items-start grid-cols-1 lg:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
        <UserInfo.Skeleton />

        <UserPlaylists.Skeleton />
      </main>
    );
  }

  const isOwner = data.user.id === currentUser?.id;

  return (
    <>
      <Helmet>
        <title>watchlist • {data.user.name}</title>
      </Helmet>

      <main className="my-4 grid items-start grid-cols-1 lg:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
        <UserInfo user={data.user} isOwner={isOwner} />

        <UserPlaylists user={data.user} isOwner={isOwner} />
      </main>
    </>
  );
}
