import { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
// import { useMediaQuery } from "react-responsive";
import {
  IoWarningOutline,
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
// import ReactIf from "../ReactIf";
import { COLORS } from "@/theme/colors";

type Props = {
  type: "success" | "info" | "error" | "warning";
  message: string;
  title?: string;
  isOpen: boolean;
  seconds?: number | null;
};

export const Alert = ({ type, message, isOpen, seconds, title }: Props) => {
  const [open, setOpen] = useState(isOpen);
  // const isDesktop = useMediaQuery({
  //   query: "(min-width: 768px)",
  // });

  const statusIcon = () => {
    switch (type) {
      case "warning":
        return <IoWarningOutline size={90} color={COLORS.warning} />;

      case "success":
        return <IoCheckmarkCircleOutline size={90} color={COLORS.success} />;
      case "error":
        return <MdErrorOutline size={90} color={COLORS.error} />;
      default:
        return <IoInformationCircleOutline size={90} color={COLORS.info} />;
    }
  };

  useEffect(() => {
    if (seconds === null) return;
    if (seconds) {
      setTimeout(() => {
        setOpen(false);
      }, seconds * 1000);
    } else {
      setTimeout(() => {
        setOpen(false);
      }, 5000);
    }
  }, [seconds]);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="dark:bg-opacity-50 backdrop-blur-md">
        <DrawerHeader className="flex flex-col items-center gap-5">
          <DrawerTitle className={"pt-5"}>
            {statusIcon()}

            {title && (
              <span className="block py-5 text-2xl font-bold text-center">
                {title}
              </span>
            )}
          </DrawerTitle>
          <DrawerDescription
            className={"pb-10 text-lg font-medium text-center"}
          >
            {message}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
    // <ReactIf
    //   condition={isDesktop}
    //   component={
    //     <Dialog open={open} onOpenChange={setOpen}>
    //       <DialogContent className="sm:max-w-[425px] dark:bg-opacity-50 backdrop-blur-md">
    //         <DialogHeader className="flex flex-col items-center gap-5">
    //           <DialogTitle className={"pt-5"}>{statusIcon()}</DialogTitle>
    //           <DialogDescription
    //             className={"pb-10 text-lg font-medium text-center"}
    //           >
    //             {message}
    //           </DialogDescription>
    //         </DialogHeader>
    //       </DialogContent>
    //     </Dialog>
    //   }
    //   fallback={
    //     <Drawer open={open} onOpenChange={setOpen}>
    //       <DrawerContent className="dark:bg-opacity-50 backdrop-blur-md">
    //         <DrawerHeader className="flex flex-col items-center gap-5">
    //           <DrawerTitle className={"pt-5"}>
    //             {statusIcon()}

    //             {title && (
    //               <span className="block py-5 text-2xl font-bold text-center">
    //                 {title}
    //               </span>
    //             )}
    //           </DrawerTitle>
    //           <DrawerDescription
    //             className={"pb-10 text-lg font-medium text-center"}
    //           >
    //             {message}
    //           </DrawerDescription>
    //         </DrawerHeader>
    //         <DrawerFooter></DrawerFooter>
    //       </DrawerContent>
    //     </Drawer>
    //   }
    // />
  );
};
