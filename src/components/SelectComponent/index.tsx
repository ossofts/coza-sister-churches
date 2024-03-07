import { ClassNameValue, twMerge } from "tailwind-merge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  label?: string;
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
  triggerExtraClass?: ClassNameValue;
  selectItemClass?: ClassNameValue;
  onChange?: (value: string) => void;
};
const SelectComponent = ({
  label,
  placeholder,
  options,
  triggerExtraClass,
  selectItemClass,
  onChange,
}: Props) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className={twMerge("w-[180px]", triggerExtraClass)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {options?.map((item, idx) => (
            <SelectItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={twMerge(selectItemClass)}
              key={idx}
              value={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
