import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { ClassNameValue, twMerge } from "tailwind-merge";

type Props = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  containerClass?: ClassNameValue;
  headerProps?: React.ComponentProps<"div">;
  title?: React.ReactNode;
  titleClass?: ClassNameValue;
  description?: React.ReactNode;
  descriptionClass?: ClassNameValue;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  footerProps?: React.ComponentProps<"div">;
  trigger?: React.ReactNode;
};

const Modal = ({
  open,
  setOpen,
  containerClass,
  headerProps,
  title,
  description,
  descriptionClass,
  children,
  footer,
  footerProps,
  trigger,
  titleClass
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className={twMerge("md:max-w-[600px]", containerClass)}>
        <DialogHeader {...headerProps}>
          {title && <DialogTitle className={twMerge(titleClass)}><span>{title}</span></DialogTitle>}
          {description && (
            <DialogDescription className={twMerge(descriptionClass)}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        {footer && <DialogFooter {...footerProps}>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
