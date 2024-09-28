import { Alert } from "@/components/Alert";
import { createRoot } from "react-dom/client";

const showAlert = (
  type: "success" | "info" | "error" | "warning",
  message: string,
  options: {
    seconds?: number | null;
    title?: string;
  } = {}
) => {
  const domNode = document.createElement("div");
  const root = createRoot(domNode);
  root.render(
    <Alert
      isOpen={true}
      type={type}
      message={message}
      seconds={options?.seconds}
      title={options?.title}
    />
  );
  document.body.appendChild(domNode);
};

export default showAlert;
