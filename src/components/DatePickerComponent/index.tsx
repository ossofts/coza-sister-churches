import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

type Props = {
  placeholder: string;
  label?: string;
  containerExtraClass?: ClassNameValue;
  labelExtraClass?: ClassNameValue;
  inputExtraClass?: ClassNameValue;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  value?: Date;
  onChange?: (e?: Date | string) => void;
  disabledPeriod: (date: Date) => boolean;
};

function DatePickerComponenent(props: Props) {
  const {
    placeholder,
    // label,
    // containerExtraClass,
    // labelExtraClass,
    // required,
    inputExtraClass,
    disabled = false,
    onChange,
    disabledPeriod,
    value,
  } = props;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal justify-start dark:bg-neutral-700",
            !value && "text-muted-foreground",
            // error
            //   ? "border-error"
            //   : "border border-gray-500 focus:border-2 focus:border-brandColor-600 ",
            inputExtraClass
          )}
        >
          <CalendarIcon className="mr-3 h-4 w-4 opacity-50" />
          {value ? (
            format(value, "PPP")
          ) : (
            <span>{placeholder ? placeholder : "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabledPeriod}
          // disabled={(date) =>
          //   date > new Date() || date < new Date("1900-01-01")
          // }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePickerComponenent;
