import { useEffect, useState } from "react";

const useColorScheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }

    if (window) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
        if (event.matches) {
          //dark mode
          setIsDarkMode(true);
        } else {
          //light mode
          setIsDarkMode(false);
        }
      });
    }

    return () =>
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", (event) => {
        if (event.matches) {
          //dark mode
          setIsDarkMode(true);
        } else {
          //light mode
          setIsDarkMode(false);
        }
      });
  }, []);

  return isDarkMode;
};

export default useColorScheme;
