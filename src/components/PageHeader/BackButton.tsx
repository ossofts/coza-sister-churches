import useNavigation from "@/hooks/useNavigation";
import { FaArrowLeftLong } from "react-icons/fa6";

type Props = {
  onBackClick?: () => void;
};
const BackButton = ({ onBackClick }: Props) => {
  const { goBack } = useNavigation();

  return (
    <FaArrowLeftLong
      onClick={onBackClick ? onBackClick : goBack}
      className="absolute left-3 top-4 cursor-pointer text-lg"
    />
  );
};

export default BackButton;
