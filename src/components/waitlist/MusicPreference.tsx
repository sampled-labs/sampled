/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { GenrePicker } from "../shared/GenrePicker";
import { Button } from "antd";
import { BsArrowLeft } from "react-icons/bs";
import { useWaitlistForm, useWaitlistFormAPI } from "../../hooks/useWaitlist";
import { toast } from "sonner";

export const MusicPreference = () => {
  const {
    onUpdateState,
    data: { fields },
  } = useWaitlistForm();

  const { mutate: submitWaitlist, isPending } = useWaitlistFormAPI();

  const toggleGenre = (genre: string): void => {
    const previous = fields.genrePreference ?? [];
    const next = previous.includes(genre)
      ? previous.filter((name: string) => name !== genre)
      : [...previous, genre];
    onUpdateState({ fields: { ...fields, genrePreference: next } });
  };

  const handleSubmit = () => {
    const submitData = {
      name: fields.name,
      email: fields.email,
      artistName: fields.artistName,
      primaryDaw: fields.primaryDAW,
      biggestStruggle: fields.biggestStruggle,
      mainGenre: fields.genrePreference?.join(", ") || undefined,
    };

    submitWaitlist(submitData, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success(response.message || "Successfully added to waitlist!");
          onUpdateState({ step: 3 });
        } else {
          toast.error(response.message || "Failed to join waitlist");
        }
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to join waitlist. Please try again.";

        if (
          errorMessage.toLowerCase().includes("duplicate") ||
          errorMessage.toLowerCase().includes("already") ||
          error?.response?.status === 400
        ) {
          toast.error("This email is already on the waitlist!");
        } else {
          toast.error(errorMessage);
        }
      },
    });
  };

  return (
    <div className="max-w-[650px] mx-auto">
      <GenrePicker selected={fields.genrePreference ?? []} onToggle={toggleGenre} />
      <div className="mt-8 md:mt-10">
        <div className="flex justify-center gap-5 items-center">
          <Button
            type="default"
            className="!rounded-full md:!px-8 md:!w-[150px] !h-[40px] !w-[140px]"
            icon={<BsArrowLeft />}
            htmlType="button"
            onClick={() => onUpdateState({ step: 1 })}
            disabled={isPending}
          >
            Prev
          </Button>
          <Button
            type="primary"
            className="!rounded-full md:!px-8 md:!w-[150px] !w-[140px] !h-[40px]"
            iconPosition="end"
            htmlType="submit"
            loading={isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>

        <p className="text-xs text-grey-300 text-center mt-5">
          Privacy and Policy
        </p>
      </div>
    </div>
  );
};
