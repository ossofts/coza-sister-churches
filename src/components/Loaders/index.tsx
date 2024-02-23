import { ClipLoader } from "react-spinners";
import { COLORS } from "@/theme/colors";

type Props = {
  color?: string;
  size?: number;
};
const FullPageSpinner = ({ color }: Props) => {
  return (
    <div className="flex justify-center items-center h-svh w-svw">
      <ClipLoader size={40} color={color ?? COLORS.primary} />
    </div>
  );
};

const Spinner = ({ color, size }: Props) => {
  return (
    <div className="inline-flex justify-center">
      <ClipLoader size={size ?? 25} color={color ?? "white"} />
    </div>
  );
};

export { FullPageSpinner, Spinner };
