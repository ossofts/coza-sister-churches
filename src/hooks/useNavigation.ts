import { useLocation, useNavigate } from "react-router-dom";

export default function useNavigation() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const goto = (
    pathname: string,
    options?: { state?: Record<string, unknown>; replace?: boolean; isNewTab?: boolean }
  ) => {
    if (options?.isNewTab) {
      return window.open(pathname, "_blank", "noopener,noreferrer");
    }
    navigate(pathname, { state: options?.state, replace: options?.replace });
  };
  const goBack = () => navigate(-1);

  return {
    goto,
    goBack,
    state
  };
}
