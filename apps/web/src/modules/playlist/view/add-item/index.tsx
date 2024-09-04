import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";

import { AddItemForm } from "./add-item-form";

export function AddItem() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="self-end">
          Add Item <Plus className="size-4 ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add to playlist</DialogTitle>
        </DialogHeader>

        <AddItemForm onAdd={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
