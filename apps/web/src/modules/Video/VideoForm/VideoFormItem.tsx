import { useFormContext } from "react-hook-form";
import { Trash } from "lucide-react";
import { InputFormItem } from "@ui/components/form/input-form-item";
import { Button } from "@ui/components/ui/button";

import { trpc } from "~utils/trpc";

import { type FormValues } from ".";

type Props = {
  index: number;
  playlistID: number;
  onDelete: () => void;
};

export function VideoFormItem({ index, playlistID, onDelete }: Props) {
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
      const inserted = await createVideo.mutateAsync({
        playlistID,
        rawUrl: video.rawUrl,
      });

      form.setValue(`videos.${index}.id`, inserted.id);
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
    <li className="flex items-end gap-8">
      <InputFormItem
        control={form.control}
        name={`videos.${index}.rawUrl`}
        label={`Video ${index + 1}`}
        placeholder="URL"
        onBlur={onBlur}
      />

      <Button variant="destructive" onClick={onClickDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </li>
  );
}
