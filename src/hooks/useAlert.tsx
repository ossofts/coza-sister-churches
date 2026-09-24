import { Alert } from "@/components/Alert";
import { createRoot } from "react-dom/client";

// several components can hit the same failure in the same tick -- e.g. every
// mounted useGeolocation reports a location error on its own, and StrictMode
// double-invokes those effects in dev -- so the same message must not stack up
// as separate drawers
const visibleMessages = new Set<string>();

const showAlert = (
  type: "success" | "info" | "error" | "warning",
  message: string,
  options: {
    seconds?: number | null;
    title?: string;
  } = {}
) => {
  if (visibleMessages.has(message)) return;
  visibleMessages.add(message);

  const domNode = document.createElement("div");
  const root = createRoot(domNode);

  const dismiss = () => {
    visibleMessages.delete(message);
    root.unmount();
    domNode.remove();
  };

  root.render(
    <Alert
      isOpen={true}
      type={type}
      message={message}
      seconds={options?.seconds}
      title={options?.title}
      onClose={dismiss}
    />
  );
  document.body.appendChild(domNode);
};

export default showAlert;
