import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Control, FieldError, FieldValues, Path } from "react-hook-form";
import { ClassNameValue, twMerge } from "tailwind-merge";
import InputErrorAlert from "../Errors/InputErrorAlert";
import ReactIf from "../ReactIf";
import { Spinner } from "../Loaders";
import { COLORS } from "@/theme/colors";

export type OptionsType = {
  label: string;
  value: string;
};

type Props<T extends FieldValues> = {
  control: Control<T, unknown>;
  name: Path<T>;
  options: OptionsType[];
  placeholder: string;
  label?: string;
  containerExtraClass?: ClassNameValue;
  labelExtraClass?: ClassNameValue;
  inputExtraClass?: ClassNameValue;
  required?: boolean;
  error?: FieldError;
  disabled?: boolean;
  isLoading?: boolean;
  // label to fall back to when the selected value has no matching option yet,
  // e.g. while the options are still being fetched
  selectedLabel?: string;
  onChange?: (e: string) => void;
};

function SelectInput<T extends FieldValues>(props: Props<T>) {
  const {
    control,
    name,
    options,
    placeholder,
    label,
    containerExtraClass,
    labelExtraClass,
    required,
    error,
    inputExtraClass,
    disabled = false,
    isLoading = false,
    selectedLabel,
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
          <Select
            onValueChange={(e) => {
              // radix mirrors the value into a hidden native <select>; when the
              // value is set programmatically to an option that hasn't loaded
              // yet, that select rejects it and echoes "" back here, which would
              // wipe the field. a real selection never reports an empty value.
              if (!e) return;
              field.onChange(e);
              if (!onChange) return;
              onChange(e);
            }}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger
                disabled={disabled}
                // style={{ backgroundColor: isDarkMode ? "neutral" : "white" }}
                style={{ backgroundColor: "neutral" }}
                className={twMerge(
                  `py-3 px-3 w-full rounded-lg outline-none text-sm`,
                  error
                    ? "border-error"
                    : "border border-gray-500 focus:border-2 focus:border-brandColor-600 bg-neutral-50 dark:bg-neutral-700",
                  inputExtraClass,
                )}
              >
                <SelectValue placeholder={placeholder}>
                  {options?.find((option) => option.value === field.value)
                    ?.label ??
                    selectedLabel ??
                    ""}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <ReactIf
                condition={!isLoading}
                component={options?.map((item, idx) => (
                  <SelectItem
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   e.stopPropagation();
                    // }}
                    key={idx}
                    value={item.value}
                  >
                    {item.label}
                  </SelectItem>
                ))}
                fallback={
                  <span className="flex justify-center">
                    <Spinner color={COLORS.brandColor[600]} />
                  </span>
                }
              />
            </SelectContent>
          </Select>
          {/* <FormMessage /> */}
          {error && <InputErrorAlert>{error.message}</InputErrorAlert>}
        </FormItem>
      )}
    />
  );
}

export default SelectInput;
