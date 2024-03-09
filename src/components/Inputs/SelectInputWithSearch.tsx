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
import { ChangeEvent, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";

type Props<T extends FieldValues> = {
  control: Control<T, unknown, T>;
  name: Path<T>;
  options: {
    label: string | number;
    value: string;
  }[];
  placeholder: string;
  label?: string;
  containerExtraClass?: ClassNameValue;
  labelExtraClass?: ClassNameValue;
  inputExtraClass?: ClassNameValue;
  required?: boolean;
  error?: FieldError;
  disabled?: boolean;
  isLoading?: boolean;
  onChange?: (e: string) => void;
};

function SelectInputWithSearch<T extends FieldValues>(props: Props<T>) {
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
    onChange,
  } = props;

  const [optionsData, setOptionsData] = useState(options);
  const [search, setSearch] = useState("");

  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target?.value);
    const filteredOptions = options?.filter((item) =>
      String(item.label)
        ?.toLowerCase()
        ?.includes(e?.target?.value?.toLowerCase())
    );
    setOptionsData(filteredOptions);
    searchRef.current?.focus();
  };

  const returnOptions = () => {
    if (search !== "") return optionsData;
    return options;
  };

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
              field.onChange(e);
              if (!onChange) return;
              onChange(e);
            }}
            defaultValue={field.value}
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
                  inputExtraClass
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent onFocus={() => searchRef.current?.focus()}>
              <ReactIf
                condition={!isLoading}
                component={
                  <>
                    <span className="py-2 w-full flex items-center border-b border-b-50 dark:border-b-gray-700">
                      <IoIosSearch className="mx-2.5" size={16} />
                      <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search"
                        className=" text-sm w-full outline-none bg-inherit border-inherit"
                        onChange={handleSearch}
                        value={search}
                      />
                    </span>
                    {returnOptions()?.length < 1 ? (
                      <span className="text-sm pl-8 py-3">No data found</span>
                    ) : (
                      returnOptions()?.map((item, idx) => (
                        <SelectItem
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          key={idx}
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      ))
                    )}
                  </>
                }
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

export default SelectInputWithSearch;
