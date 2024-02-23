import ROUTES from "@/routes";
import { matchRoutes, useLocation } from "react-router-dom";

const routes = Object.values(ROUTES).map(({ path }) => ({ path }));

export const useCurrentPath = () => {
  const location = useLocation();
  const matches = matchRoutes(routes, location);

  return {
    path: matches?.[0]?.route.path || location.pathname,
    pathname: matches?.[0]?.pathname || location.pathname,
    params: matches?.[0]?.params
  };
};
