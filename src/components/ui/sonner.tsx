import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast dark:group-[.toaster]:bg-white dark:group-[.toaster]:text-neutral-950 group-[.toaster]:border-neutral-200 group-[.toaster]:shadow-lg group-[.toaster]:bg-neutral-950 group-[.toaster]:text-neutral-50 group-[.toaster]:border-neutral-800 text-lg font-semibold",
          description:
            "dark:group-[.toast]:text-neutral-600 group-[.toast]:text-neutral-100 text-base font-medium",
          actionButton:
            "dark:group-[.toast]:bg-neutral-900 dark:group-[.toast]:text-neutral-50 group-[.toast]:bg-neutral-50 group-[.toast]:text-neutral-900",
          cancelButton:
            "group-[.toast]:bg-neutral-100 group-[.toast]:text-neutral-500 dark:group-[.toast]:bg-neutral-800 dark:group-[.toast]:text-neutral-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
