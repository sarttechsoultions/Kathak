"use client";

import { CheckCircle2, HelpCircle, Info, X, ShieldAlert } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

type DialogKind = "alert" | "confirm" | "prompt" | "success" | "error";
type DialogResolveValue = boolean | string | null;

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
  resolve?: (value: DialogResolveValue) => void;
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

// SSR pe hamesha false, client pe mount hote hi true — bina kisi Effect + setState ke,
// isliye "setState synchronously within an effect" wala warning nahi aata.
function useMounted() {
  return useSyncExternalStore(
    () => () => {}, // subscribe: koi external store nahi hai, no-op
    () => true, // client snapshot
    () => false // server snapshot
  );
}

export default function ThemeDialogProvider() {
  const [modalDialog, setModalDialog] = useState<DialogRequest | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const mounted = useMounted();

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
      const newToast: ToastItem = { id: `toast-${Date.now()}-${Math.random()}`, ...toastDetail };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => removeToast(newToast.id), 3500);
    };

    window.alert = (message?: string) => {
      const msgStr = String(message ?? "");
      const lower = msgStr.toLowerCase();
      const isSuccess = Boolean(lower.match(/(success|created|saved|updated|deleted|uploaded|added)/));
      const isError = Boolean(lower.match(/(failed|error|invalid|denied)/));

      const kind: "success" | "error" | "alert" = isSuccess ? "success" : isError ? "error" : "alert";
      const title = isSuccess ? "Action Successful!" : isError ? "Error Occurred" : "Notification";

      openToast({ kind, message: msgStr, title });
    };

    window.addEventListener(DIALOG_EVENT, handleDialog);
    window.addEventListener(TOAST_EVENT, handleToast);

    return () => {
      window.alert = nativeAlert;
      window.removeEventListener(DIALOG_EVENT, handleDialog);
      window.removeEventListener(TOAST_EVENT, handleToast);
    };
  }, []);

  const closeModal = (result: DialogResolveValue = null) => {
    modalDialog?.resolve?.(result);
    setModalDialog(null);
  };

  // Server render aur pehla client render dono mein kuch bhi render nahi hota.
  // Toasts/modal sirf client events se trigger hote hain, isliye SSR ki koi zaroorat nahi.
  if (!mounted) return null;

  return (
    <>
      {/* Top Right Floating Toast Notifications */}
      <div className="fixed top-6 right-6 z-[1000] flex flex-col gap-3 pointer-events-none max-w-[320px] w-full [font-family:'Inter',_sans-serif]">
        {toasts.map((toast) => {
          const isSuccess = toast.kind === "success";
          const isError = toast.kind === "error";

          return (
            <div
              key={toast.id}
              className="pointer-events-auto bg-white rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-top-4 fade-in"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isSuccess ? "bg-green-50 text-green-600" : isError ? "bg-red-50 text-red-600" : "bg-[#9B3434]/10 text-[#9B3434]"
                }`}
              >
                {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : isError ? <ShieldAlert className="w-4 h-4" /> : <Info className="w-4 h-4" />}
              </div>

              <div className="flex-1 pt-0.5">
                <h4 className="font-semibold text-[13px] text-gray-900 mb-0.5 [font-family:'Plus_Jakarta_Sans',_sans-serif]">
                  {toast.title}
                </h4>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog (Clean & Professional) */}
      {modalDialog && (
        <div className="fixed inset-0 z-[999] bg-gray-900/40 flex items-center justify-center p-4 transition-opacity [font-family:'Inter',_sans-serif]">
          <div className="bg-white rounded-[16px] p-6 max-w-[380px] w-full shadow-2xl animate-in zoom-in-95 duration-200">

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#9B3434]/10 text-[#9B3434] flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-bold text-[18px] text-[#0B1C30] [font-family:'Plus_Jakarta_Sans',_sans-serif]">
                  {modalDialog.title || "Please Confirm"}
                </h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">
                  {modalDialog.message}
                </p>
              </div>
            </div>

            {modalDialog.kind === "prompt" && (
              <div className="mt-5">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full h-[44px] px-4 rounded-[8px] bg-white border border-gray-200 text-gray-900 text-[14px] focus:outline-none focus:border-[#9B3434] focus:ring-1 focus:ring-[#9B3434] transition-all"
                  placeholder="Type your response..."
                />
              </div>
            )}

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => closeModal(modalDialog.kind === "prompt" ? null : false)}
                className="flex-1 h-[42px] rounded-[8px] border border-gray-200 text-gray-600 font-medium text-[14px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => closeModal(modalDialog.kind === "prompt" ? inputValue : true)}
                className="flex-1 h-[42px] rounded-[8px] bg-[#9B3434] hover:bg-[#832c2c] text-white font-medium text-[14px] transition-colors"
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