import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CGWCInstantMessage } from "@/store/types";
import { twMerge } from "tailwind-merge";

type Props = {
  item: CGWCInstantMessage;
  index: number;
   
  onClick?: (route: string, options: { state: CGWCInstantMessage }) => void;
};

const Item = ({ item, index }: Props) => {
  return (
    <AspectRatio
      key={index}
      className=" bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden relative mx-5 md:mx-10 md:scale-90 lg:scale-75"
      ratio={16 / 9}
      style={{ backgroundImage: `url(${item?.imageUrl})` }}
      onClick={() => window.open(item?.messageLink, "_blank")}
    >
      <div className={twMerge("w-full h-full bg-black bg-opacity-50")}>
        <div className=" absolute bottom-5 sm:bottom-7 md:bottom-10 lg:bottom-20">
          <p
            className={twMerge(
              "text-md sm:text-xl md:text-2xl lg:text-4xl font-semibold ml-5 text-white text-left lg:ml-20"
            )}
          >
            {item?.title}
          </p>
          <p
            className={twMerge(
              "text-white font-normal ml-5 text-wrap italic text-xs sm:text-md md:text-lg lg:2xl text-left lg:ml-20"
            )}
          >
            {item?.message}
          </p>
        </div>
      </div>
    </AspectRatio>
  );
};

export default Item;
