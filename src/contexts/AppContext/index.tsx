import { useContext } from "react";
import { AppContext } from "./AppProvider";

function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("App context must be used within AppProvider");
  }

  return context;
}

export default useAppContext;
