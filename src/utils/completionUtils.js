import { toast } from "react-toastify";
import { playWinGame } from "./soundUtils";

export const handleChallengeCompletion = (
  onCompleteChallenge,
  successMessage
) => {
  playWinGame();
  toast.success(successMessage);
  setTimeout(() => {
    onCompleteChallenge();
  }, 1500);
};
