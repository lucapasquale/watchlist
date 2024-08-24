import React from "react";
import { UseFieldArrayRemove, UseFieldArrayUpdate, useFormContext } from "react-hook-form";
import { GripVertical, Trash } from "lucide-react";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { Button } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";

import { trpc } from "~utils/trpc";

import { type FormValues } from ".";

type Props = React.ComponentProps<"li"> & {
  index: number;
  playlistID: number;
  update: UseFieldArrayUpdate<FormValues, "videos">;
  remove: UseFieldArrayRemove;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
};

export const VideoFormItem = React.forwardRef<HTMLLIElement, Props>(
  ({ index, playlistID, update, remove, dragHandleProps, ...liProps }, ref) => {
    const form = useFormContext<FormValues>();

    const createVideo = trpc.createVideo.useMutation();
    const updateVideo = trpc.updateVideo.useMutation();
    const deleteVideo = trpc.deleteVideo.useMutation();

    const onBlur = async () => {
      const video = form.getValues().videos[index];
      if (!video?.rawUrl || !form.formState.isValid) {
        return;
      }

      form.clearErrors(`videos.${index}.rawUrl`);

      if (!video.id) {
        const inserted = await createVideo.mutateAsync({
          playlistID,
          rawUrl: video.rawUrl,
        });

        return update(index, inserted);
      }

      await updateVideo.mutateAsync({
        id: video.id,
        rawUrl: video.rawUrl,
      });
    };

    const onClickDelete = async () => {
      const video = form.getValues().videos[index];
      if (video?.id) {
        await deleteVideo.mutateAsync(video.id);
      }

      remove(index);
    };

    const video = form.getValues(`videos.${index}`);

    return (
      <li ref={ref} className={cn("flex items-center gap-8", liProps.className)} {...liProps}>
        <div {...(video.id ? dragHandleProps : { className: "opacity-0" })}>
          <GripVertical className="h-4 w-4" />
        </div>

        <InputFormItem
          control={form.control}
          name={`videos.${index}.rawUrl`}
          label={`Video ${index + 1} - ${video.rank}`}
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
