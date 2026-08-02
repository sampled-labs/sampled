import {
  IWaitlistFormData,
  IWaitlistFormContext,
} from "../@types/waitlist-form";
import { createContext, useState } from "react";

const defaultData: IWaitlistFormData = {
  fields: {
    name: "",
    artistName: "",
    // primaryDAW: "Other",
    gender: "",
    email: "",
    // biggestStruggle: "Other",
    genrePreference: [],
  },
  step: 1,
};

export const waitlistFormContext = createContext<IWaitlistFormContext>({
  data: defaultData,
  onUpdateState: () => {},
});

export const WaitlistFormProvider = ({ children = <></> }) => {
  const [waitlistFormState, setWaitlistFormState] =
    useState<IWaitlistFormData>(defaultData);
  const onUpdateState = (value: Partial<IWaitlistFormData>) => {
    setWaitlistFormState((prev) => ({
      ...prev,
      ...value,
      fields: {
        ...prev.fields,
        ...(value.fields || {}),
      },
    }));
  };
  return (
    <waitlistFormContext.Provider
      value={{ data: waitlistFormState, onUpdateState }}
    >
      {children}
    </waitlistFormContext.Provider>
  );
};
