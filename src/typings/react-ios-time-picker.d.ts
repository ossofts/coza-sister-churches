declare module "react-ios-time-picker" {
  import React from "react";

  /**
   * TimePicker Component options
   */

  export interface TimePickerProps {
    value?: string;
    cellHeight?: number;
    placeholder?: string;
    pickerDefaultValue?: string;
    disabled?: boolean;
    isOpen?: boolean;
    required?: boolean;
    cancelButtonText?: string;
    saveButtonText?: string;
    controllers?: boolean;
    seperator?: boolean;
    id?: string;
    name?: string;
    use12Hours?: boolean;
    inputClassName?: string;
    popupClassName?: string;
    onChange?: (value: string) => void;
    onSave?: (value: string) => void;
    onClose?: () => void;
    onAmPmChange?: (value: string) => void;
    onOpen?: () => void;
  }

  export const TimePicker: React.ComponentType<TimePickerProps>;
}
