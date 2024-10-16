import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Control, FieldError, FieldValues, Path } from "react-hook-form";
import { ClassNameValue, twMerge } from "tailwind-merge";
import InputErrorAlert from "../Errors/InputErrorAlert";

type Props<T extends FieldValues> = {
  control: Control<T, unknown>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  containerExtraClass?: ClassNameValue;
  labelExtraClass?: ClassNameValue;
  inputExtraClass?: ClassNameValue;
  required?: boolean;
  error?: FieldError;
  disabled?: boolean;
  isLoading?: boolean;
  onChange?: (e?: Date | string) => void;
  disabledPeriod?: (date: Date) => boolean;
};

function DatePickerInput<T extends FieldValues>(props: Props<T>) {
  const {
    control,
    name,
    placeholder,
    label,
    containerExtraClass,
    labelExtraClass,
    required,
    error,
    inputExtraClass,
    disabled = false,
    onChange,
    disabledPeriod,
  } = props;
  9;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={twMerge(`flex flex-col mb-2`, containerExtraClass)}
        >
          <FormLabel
            style={{ marginBottom: 0 }}
            className={twMerge("input-label", labelExtraClass)}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={disabled}
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal justify-start dark:bg-neutral-700",
                    !field.value && "text-muted-foreground",
                    error
                      ? "border-error"
                      : "border border-gray-500 focus:border-2 focus:border-brandColor-600 ",
                    inputExtraClass
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4 opacity-50" />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{placeholder ? placeholder : "Pick a date"}</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(e) => {
                  field.onChange(e);
                  if (!onChange) return;
                  onChange(e);
                }}
                disabled={disabledPeriod || false}
                // disabled={(date) =>
                //   date > new Date() || date < new Date("1900-01-01")
                // }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {error && <InputErrorAlert>{error.message}</InputErrorAlert>}
        </FormItem>
      )}
    />
  );
}

export default DatePickerInput;
