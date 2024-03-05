import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { Control, FieldError, FieldValues, Path } from "react-hook-form";
import { ClassNameValue, twMerge } from "tailwind-merge";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Value } from "node_modules/react-time-picker/dist/esm/shared/types";
import InputErrorAlert from "../Errors/InputErrorAlert";
// import { TimePicker } from "react-ios-time-picker";

type Props<T extends FieldValues> = {
  control: Control<T, unknown, T>;
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
  onChange?: (e: Value) => void;
};

function TimePickerInput<T extends FieldValues>(props: Props<T>) {
  const {
    control,
    name,
    // placeholder,
    label,
    containerExtraClass,
    labelExtraClass,
    required,
    error,
    inputExtraClass,
    disabled = false,
    onChange,
  } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={twMerge(`flex flex-col mb-2`, containerExtraClass)}
        >
          {label && (
            <FormLabel
              style={{ marginBottom: 0 }}
              className={twMerge("input-label", labelExtraClass)}
            >
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            {/* <TimePicker
              onChange={(e) => {
                field.onChange(e);
                if (!onChange) return;
                onChange(e);
              }}
              pickerDefaultValue="00:00"
              value={field.value}
              inputClassName={twMerge(
                `py-[6px] px-3 w-full rounded-lg outline-none text-sm`,
                error
                  ? "border-error"
                  : "border border-gray-500 focus:border-2 focus:border-brandColor-600 bg-neutral-50 dark:bg-neutral-700",
                inputExtraClass
              )}
            /> */}
            <TimePicker
              disableClock
              clearIcon={null}
              clockClassName={"border-none p-0"}
              disabled={disabled}
              format="HH:mm"
              onChange={(e) => {
                field.onChange(e);
                if (!onChange) return;
                onChange(e);
              }}
              value={field.value}
              className={twMerge(
                `py-[6px] px-3 w-full rounded-lg outline-none text-sm`,
                error
                  ? "border-error"
                  : "border border-gray-500 focus:border-2 focus:border-brandColor-600 bg-neutral-50 dark:bg-neutral-700",
                inputExtraClass
              )}
            />
          </FormControl>

          {error && <InputErrorAlert>{error.message}</InputErrorAlert>}
        </FormItem>
      )}
    />
  );
}

export default TimePickerInput;
