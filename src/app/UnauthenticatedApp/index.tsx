import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import ROUTES from "@/routes";
import { FullPageSpinner } from "@/components/Loaders";

const UnauthenticatedApp = () => {
  const publicRoutes = Object.values(ROUTES)?.filter((route) => !route.isPrivate);
  return (
    <Routes>
      {publicRoutes.map(({ component: Element, ...rest }, index) => (
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
      ))}
    </Routes>
  );
};

export default UnauthenticatedApp;
