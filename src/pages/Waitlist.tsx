import { useWaitlistForm } from "../hooks/useWaitlist";
import { PersonalDetails } from "../components/waitlist/PersonalDetails";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MusicPreference } from "../components/waitlist/MusicPreference";
import { WaitlistCompleted } from "../components/waitlist/WaitlistCompleted";

const WaitlistFormPage = () => {
  const {
    // onUpdateState,
    data: {
      step,
      // fields
    },
  } = useWaitlistForm();

  useGSAP(() => {
    if (step !== 3) {
      gsap.fromTo(
        ".onboard-details",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0 },
      );
    }
  }, [step]);

  // Full-page layout for completed state
  if (step === 3) {
    return <WaitlistCompleted />;
  }

  return (
    <div className="md:py-[5rem] py-12 px-4 max-w-[700px] mx-auto">
      <div className="flex items-center justify-center flex-col gap-4 md:gap-6 mb-6 md:mb-8 max-w-[450px] mx-auto">
        <h3 className="font-pixter text-2xl">
          Join The <span className="text-primary">waitlist</span>
        </h3>
        <div className="flex gap-4 items-center w-full">
          <div className="h-[3px] rounded-full w-full relative bg-grey-600 transition-all">
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-[0.75s]"
              style={{ width: `${step * 33.33}%` }}
            ></div>
          </div>
          <div className="text-sm text-grey-300">
            <span className="text-pale-grey text-[16px]">{step}</span>/3
          </div>
        </div>
        <h2 className="md:text-xl text-lg mt-2">
          {step === 1
            ? "A little bit about yourself"
            : step === 2
              ? "Select your genre preference"
              : ""}
        </h2>
      </div>

      <div className="onboard-details">
        {step === 1 ? <PersonalDetails /> : <MusicPreference />}
      </div>
    </div>
  );
};

export default WaitlistFormPage;
