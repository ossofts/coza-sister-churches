export function registerServiceWorker(): void {
  if (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    navigator.serviceWorker
  ) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          {
            scope: "/firebase-cloud-messaging-push-scope",
          }
        );
        // console.log("Service worker registered:", registration);
        return registration;
      } catch (error) {
        console.warn("Service worker registration failed:", error);
      }
    });
  }
}
