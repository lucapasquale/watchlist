import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";

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
      <main className="my-4 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(min(350px,100%),_1fr)_3fr]">
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

      <main className="container mx-auto my-4 grid grid-cols-1 items-start gap-6 px-2 sm:px-0 lg:grid-cols-[minmax(min(350px,100%),_1fr)_3fr]">
        <UserInfo user={data.user} isOwner={isOwner} />

        <UserPlaylists userID={data.user.id} isOwner={isOwner} />
      </main>
    </>
  );
}
