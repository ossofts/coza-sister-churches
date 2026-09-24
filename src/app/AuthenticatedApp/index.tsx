import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import ROUTES from "@/routes";
import { FullPageSpinner } from "@/components/Loaders";
import AppProvider from "@/contexts/AppContext/AppProvider";
import useRole, { roles } from "@/hooks/useRoles";
import { usePrefetchUsersByCampus } from "@/services/account";

const AuthenticatedApp = () => {
  const {
    user,
    isAHOD,
    isAdmin,
    isCGWCApproved,
    isCampusPastor,
    isGlobalPastor,
    isSuperAdmin,
    isGroupHead,
    isHOD,
    isInternshipHOD,
    isQC,
    isInternship,
  } = useRole();

  const allowedRoutes = () => {
    if (isAHOD)
      return Object.values(ROUTES)?.filter(
        (route) => route?.isPrivate && route?.roles?.includes(roles.AHOD)
      );
    if (isHOD)
      return Object.values(ROUTES)?.filter(
        (route) => route?.isPrivate && route?.roles?.includes(roles.HOD)
      );
    if (isAdmin)
      return Object.values(ROUTES)?.filter(
        (route) => route?.isPrivate && route?.roles?.includes(roles.Admin)
      );
    if (isSuperAdmin)
      return Object.values(ROUTES)?.filter(
        (route) =>
          route?.isPrivate && route?.roles?.includes(roles["Super Admin"])
      );
    if (isCampusPastor)
      return Object.values(ROUTES)?.filter(
        (route) =>
          route?.isPrivate && route?.roles?.includes(roles["Campus Pastor"])
      );
    if (isGlobalPastor)
      return Object.values(ROUTES)?.filter(
        (route) =>
          route?.isPrivate && route?.roles?.includes(roles["Global Pastor"])
      );
    if (isGroupHead)
      return Object.values(ROUTES)?.filter(
        (route) => route?.isPrivate && route?.roles?.includes(roles["HOD"])
      );
    if (isQC)
      return Object.values(ROUTES)?.filter(
        (route) => route?.isPrivate && route?.roles?.includes(roles["QC"])
      );
    if (isInternship)
      return Object.values(ROUTES)?.filter(
        (route) =>
          route?.isPrivate && route?.roles?.includes(roles["Internship"])
      );
    if (isInternshipHOD)
      return Object.values(ROUTES)?.filter(
        (route) =>
          route?.isPrivate && route?.roles?.includes(roles["Internship HOD"])
      );

    return Object.values(ROUTES)?.filter(
      (route) => route?.isPrivate && route?.roles?.includes(roles["Worker"])
    );
  };

  const isAllowedAndCGWCApproved = isCGWCApproved
    ? allowedRoutes()
    : allowedRoutes()?.filter((route) => route.title !== ROUTES.CGWC.title);

  // manual clock-in searches the whole campus roster, which is the slowest
  // fetch in the app, so warm it for the people who can actually reach it
  usePrefetchUsersByCampus(
    isAllowedAndCGWCApproved.some(
      (route) => route.path === ROUTES.MANUAL_CLOCK_IN.path
    )
      ? user.campus?._id
      : undefined
  );

  return (
    <AppProvider>
      <Routes>
        {isAllowedAndCGWCApproved.map(
          ({ component: Element, ...rest }, index) => (
            <Route
              element={
                <Suspense fallback={<FullPageSpinner />}>
                  <Layout>
                    <Element />
                  </Layout>
                </Suspense>
              }
              path={rest.path}
              key={`auth-route-${index}`}
            />
          )
        )}
      </Routes>
    </AppProvider>
  );
};

export default AuthenticatedApp;
