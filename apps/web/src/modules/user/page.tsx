import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/client";

import { UserViewDocument } from "~common/graphql-types";
import { useCurrentUser } from "~common/providers/current-user-provider";
import { Route } from "~routes/u/$userID";

import { UserInfo } from "./user-info";
import { UserPlaylists } from "./user-playlists";

export function Page() {
  const { userID } = Route.useParams();
  const { user: currentUser } = useCurrentUser();

  const { loading, data } = useQuery(UserViewDocument, {
    variables: { userID },
  });

  if (loading || !data) {
    return (
      <main className="grid items-start grid-cols-1 lg:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
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

      <main className="grid items-start grid-cols-1 lg:grid-cols-[minmax(min(350px,100%),_1fr)_3fr] gap-6">
        <UserInfo user={data.user} isOwner={isOwner} />

        <UserPlaylists user={data.user} isOwner={isOwner} />
      </main>
    </>
  );
}
