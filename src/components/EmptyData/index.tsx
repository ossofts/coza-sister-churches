import Lottie from "lottie-react";
import darkAnimation from "@/assets/json/empty-dark.json";
import lightAnimation from "@/assets/json/empty.json";
import useColorScheme from "@/hooks/useColorScheme";

type Props = {
  message?: string;
  width?: string | number;
};

const EmptyData = ({ message, width = 320 }: Props) => {
  //   const {
  //     user: { gender },
  //     isCampusPastor,
  //     isGlobalPastor
  //   } = useRole();

  const gender = "M";
  const isCampusPastor = false;
  const isGlobalPastor = false;

  const EMPTY_MESSAGE = "No records to show yet";

  const isDarkMode = useColorScheme();

  return (
    <div className="flex flex-col items-center pb-4">
      <Lottie
        animationData={isDarkMode ? darkAnimation : lightAnimation}
        // resizeMode="cover"
        style={{
          width,
        }}
        autoPlay
        loop
      />
      <p className="text-sm text-gray-400 font-medium">
        {isCampusPastor || isGlobalPastor
          ? `${message ? message : EMPTY_MESSAGE} ${gender === "M" ? "sir" : "ma"}`
          : message
            ? message
            : EMPTY_MESSAGE}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="p-2 px-4 text-sm rounded-md ring-1 ring-brandColor-600 dark:ring-brandColor-500 text-brandColor-600 dark:text-brandColor-500 mt-5 font-medium shadow-md"
      >
        Reload
      </button>
    </div>
  );
};

export default EmptyData;
