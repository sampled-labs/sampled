export interface IWaitlistFormContext {
  data: IWaitlistFormData;
  onUpdateState: (value: Partial<IWaitlistFormData>) => void;
}

export interface IWaitlistFormData {
  fields: {
    name: string;
    email: string;
    gender: string;
    /** The primary Digital Audio Workstation they use */
    primaryDAW?:
      | "Ableton Live"
      | "FL Studio"
      | "Logic Pro"
      | "Pro Tools"
      | "Studio One"
      | "Cubase"
      | "Other";
    genrePreference: string[];

    biggestStruggle?:
      | "Mixing & Mastering"
      | "Sound Selection"
      | "Music Theory"
      | "Arrangement"
      | "Finishing Tracks"
      | "Other";

    artistName?: string;
  };
  step: number;
}
