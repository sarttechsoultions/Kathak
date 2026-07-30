"use client";

import { CheckCircle2, HelpCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

type DialogKind = "alert" | "confirm" | "prompt";

interface DialogRequest {
  kind: DialogKind;
  message: string;
  title?: string;
  defaultValue?: string;
  resolve?: (value: any) => void;
}

const DIALOG_EVENT = "kathak:theme-dialog";

function openDialog(request: DialogRequest) {
  window.dispatchEvent(new CustomEvent<DialogRequest>(DIALOG_EVENT, { detail: request }));
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
  const [dialog, setDialog] = useState<DialogRequest | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const nativeAlert = window.alert;
    const handleDialog = (event: Event) => {
      const request = (event as CustomEvent<DialogRequest>).detail;
      setInputValue(request.defaultValue ?? "");
      setDialog(request);
    };

    window.alert = (message?: string) => openDialog({ kind: "alert", message: String(message ?? ""), title: "Kathak by Harshita" });
    window.addEventListener(DIALOG_EVENT, handleDialog);

    return () => {
      window.alert = nativeAlert;
      window.removeEventListener(DIALOG_EVENT, handleDialog);
    };
  }, []);

  const close = (result: any = null) => {
    dialog?.resolve?.(result);
    setDialog(null);
  };

  if (!dialog) return null;

  const isConfirm = dialog.kind === "confirm";
  const isPrompt = dialog.kind === "prompt";

  return (
    <div className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 border border-stone-200 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#9E0C25] flex items-center justify-center shrink-0">
              {isConfirm ? <HelpCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-playfair font-bold text-lg text-stone-900">{dialog.title || "Notice"}</h3>
              <p className="text-xs text-stone-500 font-medium leading-relaxed mt-0.5">{dialog.message}</p>
            </div>
          </div>
          <button onClick={() => close(false)} className="p-1 text-stone-400 hover:text-stone-900 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isPrompt && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs focus:bg-white focus:outline-none focus:border-[#9E0C25]"
            placeholder="Type your response..."
          />
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          {(isConfirm || isPrompt) && (
            <button
              onClick={() => close(isPrompt ? null : false)}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => close(isPrompt ? inputValue : true)}
            className="px-5 py-2 rounded-xl bg-[#9E0C25] text-white font-extrabold text-xs shadow-xs hover:bg-[#800A1E]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
