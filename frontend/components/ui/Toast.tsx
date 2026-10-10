"use client";

import { useCallback } from "react";
import { Toaster, toast, type ToastT, type ExternalToast } from "sonner";

export interface ToastOptions extends ExternalToast {
  variant?: "default" | "success" | "error" | "warning" | "info" | "loading";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          classNames: {
            toast: "glass-elevated border border-neutral-700 text-neutral-50",
            description: "text-neutral-300",
            actionButton: "bg-brand-500 text-neutral-950 hover:bg-brand-400",
            cancelButton: "bg-neutral-800 text-neutral-200 hover:bg-neutral-700",
            closeButton: "text-neutral-400 hover:text-neutral-200",
            loader: "text-brand-400",
          },
        }}
        closeButton
        richColors
        expand={false}
        offset={100}
        gap={8}
      />
    </>
  );
}

export const useToast = () => {
  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      const variant = options?.variant || "default";
      
      switch (variant) {
        case "success":
          return toast.success(message, options);
        case "error":
          return toast.error(message, options);
        case "warning":
          return toast.warning(message, options);
        case "info":
          return toast.info(message, options);
        case "loading":
          return toast.loading(message, options);
        default:
          return toast(message, options);
      }
    },
    []
  );

  const dismiss = useCallback((id?: string | number) => {
    toast.dismiss(id);
  }, []);

  const promise = useCallback(
    <T,>(promise: Promise<T>, messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }) => {
      return toast.promise(promise, messages);
    },
    []
  );

  return { toast: showToast, dismiss, promise };
};

export { toast };
export type { ToastT };