import { ReactNode } from "react";

type Props = {
  extraClass?: string;
  children: ReactNode;
};
function InputErrorAlert(props: Props) {
  return (
    <span className={`text-error first-letter:capitalize ${props.extraClass}`} role={"alert"}>
      {props.children}
    </span>
  );
}

export default InputErrorAlert;
