import React from "react";
import { Button } from "@ui/components/ui/button";

import { CreateNew } from "./create-new";
import { ImportFromYoutube } from "./import-from-youtube";

export function CreatePlaylist() {
  const [createState, setCreateState] = React.useState<null | "new" | "youtube">(null);

  return (
    <>
      {createState === null && (
        <div className="flex gap-2">
          <Button variant="outline" type="reset" onClick={() => setCreateState("youtube")}>
            Import from Youtube
          </Button>

          <Button onClick={() => setCreateState("new")}>Create new</Button>
        </div>
      )}

      {createState === "youtube" && <ImportFromYoutube onCancel={() => setCreateState(null)} />}
      {createState === "new" && <CreateNew onCancel={() => setCreateState(null)} />}
    </>
  );
}
