import React from "react";
import { DeepPartial, useFieldArray, useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { z } from "zod";
import {
  DragDropContext,
  Draggable,
  DraggableStyle,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/ui/button";
import { Form } from "@ui/components/ui/form";

import { trpc } from "~utils/trpc";

import { getMoveInput } from "./utils";
import { VideoFormItem } from "./VideoFormItem";

const schema = z.object({
  videos: z.array(
    z.object({
      id: z.number().positive().optional(),
      rank: z.string().nullish(),
      rawUrl: z.string().trim(),
    }),
  ),
});
export type FormValues = z.infer<typeof schema>;

type Props = {
  playlistID: number;
  defaultValues?: DeepPartial<FormValues>;
};

export function VideoForm({ playlistID, defaultValues }: Props) {
  const moveVideo = trpc.moveVideo.useMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, append, remove, move, update } = useFieldArray({
    control: form.control,
    name: "videos",
    keyName: "key",
  });

  const onDragEnd = async (result: DropResult) => {
    const values = form.getValues();
    const moveInput = getMoveInput(values, result);

    if (!result.destination || !moveInput) {
      return;
    }

    move(result.source.index, result.destination.index);

    const updatedVideo = await moveVideo.mutateAsync(moveInput);
    form.setValue(`videos.${result.destination.index}.rank`, updatedVideo.rank);
  };

  const grid = 8;
  const getItemStyle = (isDragging: boolean, draggableStyle: DraggableStyle | undefined) =>
    ({
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
      padding: grid * 2,
      margin: `0 0 ${grid}px 0`,

      // change background colour if dragging
      background: isDragging ? "lightgreen" : "grey",

      // styles we need to apply on draggables
      ...draggableStyle,
    }) as React.CSSProperties;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => console.log("onSubmit"))}
        className="w-full flex flex-col gap-8"
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <ol className="flex flex-col" ref={provided.innerRef} {...provided.droppableProps}>
                {fields.map((field, index) => (
                  <Draggable
                    key={field.key}
                    isDragDisabled={!field.id}
                    draggableId={field.id?.toString() ?? "empty"}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <VideoFormItem
                        index={index}
                        playlistID={playlistID}
                        update={update}
                        remove={remove}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </ol>
            )}
          </Droppable>
        </DragDropContext>

        {fields.every((v) => !!v.id) && (
          <Button variant="default" onClick={() => append({ rawUrl: "" })}>
            Add <Plus className="ml-1 w-4 h-4" />
          </Button>
        )}
      </form>
    </Form>
  );
}
