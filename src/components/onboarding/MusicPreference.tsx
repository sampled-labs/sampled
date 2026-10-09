import { useOnboarding } from "../../hooks/useOnboarding";
import { GenrePicker } from "../shared/GenrePicker";
import { Button } from "antd";

import { BsArrowLeft } from "react-icons/bs";

export const MusicPreference = () => {
  const {
    onUpdateState,
    data: { fields },
  } = useOnboarding();

  const toggleGenre = (genre: string): void => {
    const previous = fields.preference ?? [];
    const next = previous.includes(genre)
      ? previous.filter((name: string) => name !== genre)
      : [...previous, genre];
    onUpdateState({ fields: { ...fields, preference: next } });
  };

  return (
    <div className="max-w-[650px] mx-auto">
      <GenrePicker selected={fields.preference ?? []} onToggle={toggleGenre} />
      <div className="mt-8 md:mt-10">
        <div className="flex justify-center gap-5 items-center">
          <Button
            type="default"
            className="!rounded-full md:!px-8 md:!w-[150px] !h-[40px] !w-[140px]"
            icon={<BsArrowLeft />}
            htmlType="button"
            onClick={() => onUpdateState({ step: 2 })}
          >
            Prev
          </Button>
          <Button
            type="primary"
            className="!rounded-full md:!px-8 md:!w-[150px] !w-[140px] !h-[40px]"
            iconPosition="end"
            htmlType="submit"
            onClick={() => {
              onUpdateState({
                step: 4,
              });
            }}
          >
            Submit
          </Button>
        </div>

        <p className="text-xs text-grey-300 text-center mt-5">
          Privacy and Policy
        </p>
      </div>
    </div>
  );
};
