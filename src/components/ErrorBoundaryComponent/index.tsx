const ErrorBoundaryComponent = () => {
  return (
    <div className="h-svh flex flex-col gap-5 justify-center items-center">
      <p className="text-xl p-2 ring-2 rounded-md ring-brandColor-600 text-brandColor-600 dark:ring-brandColor-500 dark:text-brandColor-500">
        Oops! Something went wrong.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="p-2 px-4 rounded-md bg-brandColor-600 text-gray-50"
      >
        Refresh page
      </button>
    </div>
  );
};

export default ErrorBoundaryComponent;
