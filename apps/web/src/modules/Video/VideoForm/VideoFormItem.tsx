import React from "react";
import { useFormContext } from "react-hook-form";
import { GripVertical, Trash } from "lucide-react";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { Button } from "@ui/components/ui/button";

import { trpc } from "~utils/trpc";

import { type FormValues } from ".";

type Props = React.ComponentProps<"li"> & {
  index: number;
  playlistID: number;
  onDelete: () => void;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
};

export const VideoFormItem = React.forwardRef<HTMLLIElement, Props>(
  ({ index, playlistID, onDelete, dragHandleProps, ...liProps }, ref) => {
    const form = useFormContext<FormValues>();

    const createVideo = trpc.createVideo.useMutation();
    const updateVideo = trpc.updateVideo.useMutation();

    const onBlur = async () => {
      const video = form.getValues().videos[index];
      if (!video || !form.formState.isValid) {
        return;
      }

      form.clearErrors(`videos.${index}.rawUrl`);

      if (!video.id) {
        console.log("calling with", video);
        const inserted = await createVideo.mutateAsync({
          playlistID,
          rawUrl: video.rawUrl,
        });

        form.setValue(`videos.${index}.id`, inserted.id);
        form.setValue(`videos.${index}.rank`, inserted.rank);
        return;
      }

      await updateVideo.mutateAsync({
        id: video.id,
        rawUrl: video.rawUrl,
      });
    };

    const onClickDelete = async () => {
      const video = form.getValues().videos[index];
      if (!video) {
        return;
      }

      if (video.id) {
        // TODO: delete video
      }

      onDelete();
    };

    return (
      <li ref={ref} className="flex items-center gap-8" {...liProps}>
        <div {...dragHandleProps}>
          <GripVertical className="h-4 w-4" />
        </div>

        <InputFormItem
          control={form.control}
          name={`videos.${index}.rawUrl`}
          label={`Video ${index + 1} - ${form.getValues(`videos.${index}.rank`)}`}
          placeholder="URL"
          onBlur={onBlur}
        />

        <Button variant="destructive" onClick={onClickDelete}>
          <Trash className="h-4 w-4" />
        </Button>
      </li>
    );
  },
);
