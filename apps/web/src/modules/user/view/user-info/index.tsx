import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar.js";
import { Card, CardHeader, CardTitle } from "@ui/components/ui/card.js";
import { Skeleton } from "@ui/components/ui/skeleton.js";

import { UserProviderQuery } from "~common/graphql-types.js";

type Props = {
  user: Omit<UserProviderQuery["me"], "__typename" | "email">;
};

export function UserInfo({ user }: Props) {
  return (
    <Card className="bg-card flex flex-col gap-4 rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={user.profilePictureUrl ?? undefined} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>

          {user.name}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

UserInfo.Skeleton = () => (
  <section className="flex flex-col gap-4">
    <Skeleton className="h-[154px]" />
  </section>
);
