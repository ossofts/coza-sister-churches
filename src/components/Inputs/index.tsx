import { normalizeNumberValue } from "@/utils/formInputUtils";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";
import InputErrorAlert from "../Errors/InputErrorAlert";
import { useState } from "react";
import {
  IoEyeOffOutline,
  IoEyeOutline,
  IoLockClosedOutline,
} from "react-icons/io5";

interface Props<T extends FieldValues = FieldValues> {
  name: Extract<keyof T, string>;
  label?: string;
  placeholder?: string;
  optional?: boolean;
  maxLength?: number;
  minLength?: number;
  type?: "email" | "text" | "number" | "tel" | "url";
  value?: string;
  defaultValue?: string;
  inputExtraClass?: string;
  labelExtraClass?: string;
  error?: FieldError;
  containerExtraClass?: string;
  suffixText?: string;
  onSuffixClick?: () => void;
  register?: UseFormRegister<T>;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function TextInput<T extends FieldValues = FieldValues>(props: Props<T>) {
  const {
    type = "text",
    name,
    error,
    containerExtraClass = "",
    inputExtraClass,
    label,
  } = props;
  const { register, defaultValue, value, optional = false, suffixText } = props;
  const fieldRegister = register?.(name as unknown as Path<T>);

  return (
    <div className={twMerge(`flex flex-col mb-2`, containerExtraClass)}>
      {label && (
        <label
          className={twMerge("input-label", props.labelExtraClass)}
          htmlFor={name}
        >
          {label} {!optional && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          className={twMerge(
            `py-2.5 px-4 w-full rounded-lg outline-none focus:border focus:border-brandColor-600 text-sm`,
            error ? "border border-error" : "border border-red-500",
            inputExtraClass
          )}
          type={type === "number" ? "text" : type}
          placeholder={props.placeholder ?? ""}
          maxLength={props.maxLength}
          minLength={props.minLength}
          defaultValue={defaultValue}
          value={value}
          id={name}
          {...props.inputProps}
          {...(register ? fieldRegister : {})}
          onChange={(e) => {
            fieldRegister?.onChange(e);
            props.onChange?.(e);
          }}
          {...(type === "number"
            ? { onInput: (e) => normalizeNumberValue(e) }
            : {})}
        />
        {/* {error && (
            <RiErrorWarningFill className={`absolute top-2.5 right-4 text-error`} size={20} />
          )} */}
        {suffixText && (
          <button
            className="absolute top-2.5 right-8 text-blue-900 text-sm"
            onClick={(e) => {
              e.preventDefault();
              props.onSuffixClick?.();
            }}
          >
            {suffixText}
          </button>
        )}
      </div>
      {error && <InputErrorAlert>{error.message}</InputErrorAlert>}
    </div>
  );
}

export default TextInput;

export function TextInputWithIcon<T extends FieldValues = FieldValues>(
  props: Props<T>
) {
  const {
    type = "text",
    name,
    error,
    containerExtraClass = "",
    inputExtraClass,
    label,
    leftIcon,
    rightIcon,
  } = props;
  const { register, defaultValue, value, optional = false } = props;
  const fieldRegister = register?.(name as unknown as Path<T>);

  return (
    <div className={twMerge(`flex flex-col mb-2`, containerExtraClass)}>
      {label && (
        <label
          className={twMerge(
            "input-label",
            error && "text-red-500 dark:text-red-900",
            props.labelExtraClass
          )}
          htmlFor={name}
        >
          {label} {!optional && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span
            className={twMerge(
              `absolute top-2.5 left-2.5 text-[22px] font-semibold`
            )}
          >
            {leftIcon}
          </span>
        )}

        <input
          className={twMerge(
            `py-2.5 px-3 w-full rounded-lg outline-none text-sm`,
            error
              ? "border-error"
              : "border border-gray-500 focus:border-2 focus:border-brandColor-600 ",
            leftIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
            inputExtraClass
          )}
          type={type === "number" ? "text" : type}
          placeholder={props.placeholder ?? ""}
          maxLength={props.maxLength}
          minLength={props.minLength}
          defaultValue={defaultValue}
          value={value}
          id={name}
          {...props.inputProps}
          {...(register ? fieldRegister : {})}
          onChange={(e) => {
            fieldRegister?.onChange(e);
            props.onChange?.(e);
          }}
          {...(type === "number"
            ? { onInput: (e) => normalizeNumberValue(e) }
            : {})}
        />

        {rightIcon && (
          <span
            className={twMerge(
              `absolute top-2.5 right-2.5 text-[22px] font-semibold`
            )}
          >
            {rightIcon}
          </span>
        )}
      </div>
      {error && <InputErrorAlert>{error.message}</InputErrorAlert>}
    </div>
  );
}

export function PasswordInput<T extends FieldValues = FieldValues>(
  props: Props<T>
) {
  const {
    type = "text",
    name,
    error,
    containerExtraClass = "",
    inputExtraClass,
    label,
  } = props;

  const [hidePassword, setHidePassword] = useState(true);
  const toggleHidePassword = () => setHidePassword((prev) => !prev);
  const { register, defaultValue, value, optional = false } = props;
  const fieldRegister = register?.(name as unknown as Path<T>);

  return (
    <div className={twMerge(`flex flex-col mb-2`, containerExtraClass)}>
      {label && (
        <label
          className={twMerge(
            "input-label",
            error && "text-red-500 dark:text-red-900",
            props.labelExtraClass
          )}
          htmlFor={name}
        >
          {label} {!optional && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <span
          className={twMerge(
            `absolute top-2.5 left-2.5 text-[22px] font-semibold`
          )}
        >
          <IoLockClosedOutline />
        </span>

        <input
          className={twMerge(
            `py-2.5 px-3 w-full rounded-lg outline-none text-sm`,
            error
              ? "border-error"
              : "border border-gray-500 focus:border-2 focus:border-brandColor-600 ",
            "pl-10",
            "pr-10",
            inputExtraClass
          )}
          type={hidePassword ? "password" : "text"}
          placeholder={props.placeholder ?? ""}
          maxLength={props.maxLength}
          minLength={props.minLength}
          defaultValue={defaultValue}
          value={value}
          id={name}
          {...props.inputProps}
          {...(register ? fieldRegister : {})}
          onChange={(e) => {
            fieldRegister?.onChange(e);
            props.onChange?.(e);
          }}
          {...(type === "number"
            ? { onInput: (e) => normalizeNumberValue(e) }
            : {})}
        />

        <span
          className={twMerge(
            `absolute top-2.5 right-2.5 text-[22px] font-semibold cursor-pointer`
          )}
        >
          {hidePassword ? (
            <IoEyeOffOutline onClick={toggleHidePassword} />
          ) : (
            <IoEyeOutline onClick={toggleHidePassword} />
          )}
        </span>
      </div>
      {error && <InputErrorAlert>{error.message}</InputErrorAlert>}
    </div>
  );
}

interface TextboxProps<T extends FieldValues = FieldValues> {
  name: Extract<keyof T, string>;
  label?: string;
  placeholder?: string;
  optional?: boolean;
  maxLength?: number;
  minLength?: number;
  value?: string;
  defaultValue?: string;
  inputExtraClass?: string;
  labelExtraClass?: string;
  error?: FieldError;
  containerExtraClass?: string;
  suffixText?: string;
  onSuffixClick?: () => void;
  register?: UseFormRegister<T>;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputProps?: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >;
}

export function TextboxInput<T extends FieldValues = FieldValues>(
  props: TextboxProps<T>
) {
  const {
    name,
    error,
    containerExtraClass = "",
    inputExtraClass,
    label,
  } = props;
  const { register, defaultValue, value, optional = false } = props;
  const fieldRegister = register?.(name as unknown as Path<T>);

  return (
    <div className={twMerge(`flex flex-col mb-2`, containerExtraClass)}>
      {label && (
        <label
          className={twMerge(
            "input-label",
            error && "text-red-500 dark:text-red-900",
            props.labelExtraClass
          )}
          htmlFor={name}
        >
          {label} {!optional && <span className="text-red-500">*</span>}
        </label>
      )}

      <textarea
        className={twMerge(
          `py-2.5 px-3 w-full rounded-lg outline-none text-sm`,
          error
            ? "border-error"
            : "border border-gray-500 focus:border-2 focus:border-brandColor-600 ",
          inputExtraClass
        )}
        placeholder={props.placeholder ?? ""}
        maxLength={props.maxLength}
        minLength={props.minLength}
        defaultValue={defaultValue}
        value={value}
        id={name}
        {...props.inputProps}
        {...(register ? fieldRegister : {})}
        onChange={(e) => {
          fieldRegister?.onChange(e);
          props.onChange?.(e);
        }}
      />

      {error && <InputErrorAlert>{error.message}</InputErrorAlert>}
    </div>
  );
}
