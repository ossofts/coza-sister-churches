import ErrorBoundaryComponent from "@/components/ErrorBoundaryComponent";
import showAlert from "@/hooks/useAlert";
import useNavigation from "@/hooks/useNavigation";
import { useEffect } from "react";

const CgwcResources = () => {
  const { state } = useNavigation();
  // console.log({ state });

  useEffect(() => {
    if (!state) {
      showAlert("error", "Oops! Something went wrong. Please go back to the CGWC page.");
      return;
    }

    window.open(state?.messageLink, "new");
  }, [state]);

  if (!state) return <ErrorBoundaryComponent />;

  return (
    <iframe
      name="new"
      style={{ width: "100%", height: "100svh" }}
      sandbox="allow-scripts  allow-downloads"
      loading="lazy"
      // src={state?.messageLink}
    ></iframe>
  );
};

export default CgwcResources;
