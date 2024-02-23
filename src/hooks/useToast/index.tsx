import useColorScheme from "@/hooks/useColorScheme";
import { toast } from "react-toastify";

export const toastify = (
  msg: string,
  type: "success" | "error" | "info" | "warn",
  theme: "light" | "dark" | "colored" = "dark"
) => {
  // let bgColor;
  // if (type === "success") {
  //   bgColor = "#0C9667";
  // } else if (type === "error") {
  //   bgColor = "#FF4746";
  // } else if (type === "warn") {
  //   bgColor = "#e2a91b";
  // }

  return toast[type](msg, {
    theme: theme,
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
    // style: { color: "#ffffff", backgroundColor: bgColor }
  });
};

export const useToast = () => {
  const isDarkMode = useColorScheme();

  const theme = () => {
    switch (isDarkMode) {
      case true:
        return "dark";

      case false:
        return "light";

      default:
        return "dark";
    }
  };

  const success = (msg: string) => toastify(msg, "success", theme());
  const info = (msg: string) => toastify(msg, "info", theme());
  const warn = (msg: string) => toastify(msg, "warn", theme());
  const error = (msg?: string) =>
    toastify(msg || "Unexpected error occured! try again later", "error", theme());

  return {
    success,
    info,
    warn,
    error
  };
};
