import useColorScheme from "@/hooks/useColorScheme";
import blackLogo from "@/assets/images/COZA-Logo-black.png";
import whiteLogo from "@/assets/images/COZA-Logo-white.png";

const Logo = () => {
  const isDarkMode = useColorScheme();
  return <img src={isDarkMode ? whiteLogo : blackLogo} alt="" />;
};

export default Logo;
