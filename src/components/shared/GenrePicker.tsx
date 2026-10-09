import { Avatar } from "antd";
import { musicGenres } from "../../constants/genres";

interface GenrePickerProps {
  selected: readonly string[];
  onToggle: (genre: string) => void;
}

/** Shared presentation; each flow owns persistence and navigation. */
export function GenrePicker({ selected, onToggle }: GenrePickerProps) {
  return (
    <div className="flex items-center gap-4 md:gap-7 justify-center flex-wrap">
      {musicGenres.map((genre) => {
        const isSelected = selected.includes(genre.name);
        return (
          <button
            type="button"
            key={genre.name}
            aria-pressed={isSelected}
            className={`flex items-center gap-3 px-4 py-2 rounded-md bg-grey-800 cursor-pointer ${isSelected ? "!border-[1px] !border-primary" : ""}`}
            onClick={() => onToggle(genre.name)}
          >
            <Avatar
              src={genre.image}
              className="md:!h-[2rem] md:!w-[2rem] !h-[2rem] !w-[2rem] relative transition-all"
            />
            <span>{genre.name}</span>
          </button>
        );
      })}
    </div>
  );
}
