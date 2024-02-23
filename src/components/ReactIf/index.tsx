import { ReactNode } from "react";

const ReactIf = ({
  condition,
  component,
  fallback
}: {
  condition: boolean;
  component: ReactNode;
  fallback?: ReactNode;
}) => {
  if (condition) return component;
  if (fallback === undefined) return null;
  return fallback;
};

export default ReactIf;
