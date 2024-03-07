import ReactIf from "../ReactIf";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { twMerge } from "tailwind-merge";

type Props = {
  src: string;
  alt?: string;
  fallback?: string;
  extraClass?: string;
  badge?: boolean;
};

const AvatarComponent = ({
  src,
  alt,
  fallback,
  extraClass,
  badge = false,
}: Props) => {
  return (
    <ReactIf
      condition={badge}
      component={
        <div className="relative w-fit h-fit">
          <Avatar className={twMerge("w-7 h-7", extraClass)}>
            <AvatarImage src={src} alt={alt ?? ""} />
            <AvatarFallback className="bg-green-700 dark:bg-green-800 text-white">
              {fallback ?? "AA"}
            </AvatarFallback>
          </Avatar>
          {/* <span className="bg-green-500 w-[30%] h-[30%] absolute bottom-[7%] right-[7%] rounded-full border-2 border-black"></span> */}
        </div>
      }
      fallback={
        <Avatar className={twMerge("w-7 h-7", extraClass)}>
          <AvatarImage src={src} alt={alt ?? ""} />
          <AvatarFallback>{fallback ?? "AA"}</AvatarFallback>
        </Avatar>
      }
    />
  );
};

export default AvatarComponent;
