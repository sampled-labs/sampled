import { useMutation } from "@tanstack/react-query";
import { waitlistFormContext } from "../context/waitlist-form-context";
import { use } from "react";
import axios from "axios";

const WAITLIST_API_URL = "https://sampled-waitlist-be.mezo.host";

export interface WaitlistSubmitData {
  name: string;
  email: string;
  primaryDaw?:
    | "Ableton Live"
    | "FL Studio"
    | "Logic Pro"
    | "Pro Tools"
    | "Studio One"
    | "Cubase"
    | "Other";
  mainGenre?: string;
  biggestStruggle?:
    | "Mixing & Mastering"
    | "Sound Selection"
    | "Music Theory"
    | "Arrangement"
    | "Finishing Tracks"
    | "Other";
  artistName?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
}

export const useWaitlistForm = () => {
  return use(waitlistFormContext);
};

export const useWaitlistFormAPI = () => {
  return useMutation({
    mutationKey: ["waitlist"],
    mutationFn: async (data: WaitlistSubmitData) => {
      const response = await axios.post<WaitlistResponse>(
        `${WAITLIST_API_URL}/waitlist`,
        data,
      );
      return response.data;
    },
  });
};
