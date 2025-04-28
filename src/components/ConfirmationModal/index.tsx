import Modal from "../Modal";
import { ClassNameValue, twMerge } from "tailwind-merge";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  titleClass?: ClassNameValue;
  description?: string | React.ReactNode;
  descriptionClass?: ClassNameValue;
  confirmationText?: string;
  onConfirmationClick: () => void;
};

const ConfirmationModal = ({
  open,
  setOpen,
  title,
  titleClass,
  description,
  descriptionClass,
  confirmationText,
  onConfirmationClick,
}: Props) => {
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={title}
      titleClass={titleClass}
      description={description}
      descriptionClass={twMerge("", descriptionClass)}
      footer={
        <div className={twMerge("flex items-center gap-8")}>
          <button
            onClick={() => setOpen(false)}
            className="outline-none text-lg font-semibold px-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmationClick}
            className="outline-none text-lg font-semibold px-1 "
          >
            {confirmationText ?? "Yes"}
          </button>
        </div>
      }
    ></Modal>
  );
};

export default ConfirmationModal;
