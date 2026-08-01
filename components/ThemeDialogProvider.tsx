"use client";

import { CheckCircle2, HelpCircle, Info, X, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

type DialogKind = "alert" | "confirm" | "prompt" | "success" | "error";

interface ToastItem {
  id: string;
  kind: "success" | "error" | "alert";
  title: string;
  message: string;
}

interface DialogRequest {
  kind: DialogKind;
  message: string;
  title?: string;
  defaultValue?: string;
  resolve?: (value: any) => void;
}

const DIALOG_EVENT = "kathak:theme-dialog";
const TOAST_EVENT = "kathak:theme-toast";

function openDialog(request: DialogRequest) {
  window.dispatchEvent(new CustomEvent<DialogRequest>(DIALOG_EVENT, { detail: request }));
}

function openToast(toast: Omit<ToastItem, "id">) {
  window.dispatchEvent(new CustomEvent<Omit<ToastItem, "id">>(TOAST_EVENT, { detail: toast }));
}

export function openThemeSuccess(message: string, title = "Success!"): Promise<void> {
  openToast({ kind: "success", message, title });
  return Promise.resolve();
}

export function openThemeError(message: string, title = "Error"): Promise<void> {
  openToast({ kind: "error", message, title });
  return Promise.resolve();
}

export function openThemeConfirm(message: string, title = "Please confirm"): Promise<boolean> {
  return new Promise<boolean>((resolve) =>
    openDialog({ kind: "confirm", message, title, resolve: (res) => resolve(Boolean(res)) })
  );
}

export function openThemePrompt(message: string, title = "Enter details", defaultValue = ""): Promise<string | null> {
  return new Promise<string | null>((resolve) =>
    openDialog({ kind: "prompt", message, title, defaultValue, resolve: (res) => resolve(typeof res === "string" ? res : null) })
  );
}

export default function ThemeDialogProvider() {
  const [modalDialog, setModalDialog] = useState<DialogRequest | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const nativeAlert = window.alert;

    const handleDialog = (event: Event) => {
      const request = (event as CustomEvent<DialogRequest>).detail;
      if (request.kind === "success" || request.kind === "error" || request.kind === "alert") {
        openToast({
          kind: request.kind === "error" ? "error" : request.kind === "success" ? "success" : "alert",
          title: request.title || (request.kind === "success" ? "Success!" : request.kind === "error" ? "Error" : "Notice"),
          message: request.message
        });
        request.resolve?.(true);
      } else {
        setInputValue(request.defaultValue ?? "");
        setModalDialog(request);
      }
    };

    const handleToast = (event: Event) => {
      const toastDetail = (event as CustomEvent<Omit<ToastItem, "id">>).detail;
      const newToast: ToastItem = {
        id: `toast-${Date.now()}-${Math.random()}`,
        ...toastDetail
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 3.5 seconds
      setTimeout(() => {
        removeToast(newToast.id);
      }, 3500);
    };

    window.alert = (message?: string) => {
      const msgStr = String(message ?? "");
      const lower = msgStr.toLowerCase();

      const isSuccess =
        lower.includes("success") ||
        lower.includes("created") ||
        lower.includes("saved") ||
        lower.includes("updated") ||
        lower.includes("deleted") ||
        lower.includes("uploaded") ||
        lower.includes("added");

      const isError =
        lower.includes("failed") ||
        lower.includes("error") ||
        lower.includes("invalid") ||
        lower.includes("denied");

      const kind = isSuccess ? "success" : isError ? "error" : "alert";
      const title = isSuccess ? "Action Successful!" : isError ? "Error Occurred" : "Notification";

      openToast({ kind: kind as any, message: msgStr, title });
    };

    window.addEventListener(DIALOG_EVENT, handleDialog);
    window.addEventListener(TOAST_EVENT, handleToast);

    return () => {
      window.alert = nativeAlert;
      window.removeEventListener(DIALOG_EVENT, handleDialog);
      window.removeEventListener(TOAST_EVENT, handleToast);
    };
  }, []);

  const closeModal = (result: any = null) => {
    modalDialog?.resolve?.(result);
    setModalDialog(null);
  };

  return (
    <>
      {/* Top Right Floating Toast Notifications Stack */}
      <div className="fixed top-6 right-6 z-[1000] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => {
          const isSuccess = toast.kind === "success";
          const isError = toast.kind === "error";

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 border shadow-xl flex items-start gap-3.5 transition-all duration-300 animate-in slide-in-from-top-5 fade-in relative overflow-hidden ${
                isSuccess
                  ? "border-emerald-200/80 shadow-emerald-950/10"
                  : isError
                  ? "border-rose-200/80 shadow-rose-950/10"
                  : "border-stone-200 shadow-stone-900/10"
              }`}
            >
              {/* Left Color Accent Bar */}
              <div
                className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                  isSuccess ? "bg-emerald-500" : isError ? "bg-rose-600" : "bg-[#9E0C25]"
                }`}
              />

              {/* Toast Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isSuccess
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                    : isError
                    ? "bg-rose-50 text-rose-600 border border-rose-200/60"
                    : "bg-rose-50 text-[#9E0C25]"
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isError ? (
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                ) : (
                  <Info className="w-5 h-5 text-[#9E0C25]" />
                )}
              </div>

              {/* Toast Content */}
              <div className="flex-1 space-y-0.5 pr-2">
                <h4 className="font-sans font-bold text-xs text-stone-900 leading-snug">
                  {toast.title}
                </h4>
                <p className="font-sans text-[11.5px] font-medium text-stone-600 leading-relaxed">
                  {toast.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog for Confirmations / Prompts */}
      {modalDialog && (
        <div className="fixed inset-0 z-[999] bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 border border-stone-100 animate-in zoom-in-95 duration-200 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#9E0C25] to-rose-600" />

            <button
              onClick={() => closeModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center space-y-3 pt-2">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200/80 shadow-amber-500/10 flex items-center justify-center shadow-lg">
                <HelpCircle className="w-9 h-9 text-amber-600" />
              </div>

              <div className="space-y-1 text-center max-w-xs mx-auto">
                <h3 className="font-sans font-bold text-xl text-stone-900 tracking-tight">
                  {modalDialog.title || "Please Confirm"}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed pt-1">
                  {modalDialog.message}
                </p>
              </div>
            </div>

            {modalDialog.kind === "prompt" && (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                placeholder="Type your response..."
              />
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => closeModal(modalDialog.kind === "prompt" ? null : false)}
                className="flex-1 h-11 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => closeModal(modalDialog.kind === "prompt" ? inputValue : true)}
                className="flex-1 h-11 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
