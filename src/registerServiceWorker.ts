export function registerServiceWorker(): void {
  if ("serviceWorker" in navigator) {
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
        console.error("Service worker registration failed:", error);
      }
    });
  }
}
