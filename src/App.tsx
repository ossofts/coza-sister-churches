import AuthenticatedApp from "@/app/AuthenticatedApp";
import UnauthenticatedApp from "@/app/UnauthenticatedApp";
import { FullPageSpinner } from "@/components/Loaders";
import { Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryComponent from "./components/ErrorBoundaryComponent";
import useUserStore from "./store/userStore";
// import withSplashScreen from "./components/withSplashScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchInterval: 60000,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (navigator.userAgent.indexOf("iPhone") > -1) {
      document
        .querySelector("[name=viewport]")!
        .setAttribute(
          "content",
          "width=device-width, initial-scale=1, maximum-scale=1"
        );
    }
  }, []);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<ErrorBoundaryComponent />}>
          <Suspense fallback={<FullPageSpinner />}>
            {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
          </Suspense>
        </ErrorBoundary>
        <ReactQueryDevtools />
      </QueryClientProvider>
      <ToastContainer />
    </>
  );
}

// export default withSplashScreen(App);
export default App;
