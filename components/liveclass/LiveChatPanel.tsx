"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { getSocket } from "../../lib/socket";

type ChatMessage = { id: string; senderName: string; text: string; sentAt: string };

export function LiveChatPanel({
  roomName,
  senderName,
  userRole = "Student"
}: {
  roomName: string;
  senderName: string;
  userRole?: string;
}) {
  // Initialize messages from localStorage if available
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== "undefined" && roomName) {
      try {
        const cached = localStorage.getItem(`kathak_chat_${roomName}`);
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse cached chat history:", e);
      }
    }
    return [];
  });

  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sync state to localStorage whenever messages update
  useEffect(() => {
    if (typeof window !== "undefined" && roomName && messages.length > 0) {
      try {
        localStorage.setItem(`kathak_chat_${roomName}`, JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to cache chat history:", e);
      }
    }
  }, [roomName, messages]);

  useEffect(() => {
    const socket = getSocket();

    const onChatHistory = (history: ChatMessage[]) => {
      if (Array.isArray(history) && history.length > 0) {
        setMessages((prev) => {
          const map = new Map<string, ChatMessage>();
          prev.forEach((m) => map.set(m.id, m));
          history.forEach((m) => map.set(m.id, m));
          return Array.from(map.values()).sort(
            (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          );
        });
      }
    };

    const onMessage = (message: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    socket.on("liveclass:chat-history", onChatHistory);
    socket.on("liveclass:message", onMessage);

    return () => {
      socket.off("liveclass:chat-history", onChatHistory);
      socket.off("liveclass:message", onMessage);
    };
  }, [roomName, senderName, userRole]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      senderName: senderName || "User",
      text: text.trim(),
      sentAt: new Date().toISOString(),
    };

    // Emit to socket room
    const socket = getSocket();
    socket.emit("liveclass:message", { roomName, message: newMsg });

    // Optimistically update local message list
    setMessages((prev) => {
      if (prev.some((m) => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });

    setText("");
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-stone-200 bg-white shadow-2xs overflow-hidden">
      <div className="border-b border-stone-100 px-5 py-4 font-extrabold text-stone-900 text-sm flex items-center justify-between">
        <span>Live Chat</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <p className="text-xs text-stone-400 italic text-center py-6">
            No messages yet. Send a message to start chatting!
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="text-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-stone-900 text-xs">{m.senderName}</span>
                <span className="text-[10px] font-semibold text-stone-400">
                  {new Date(m.sentAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="rounded-2xl bg-stone-100/90 px-3.5 py-2.5 text-stone-800 font-medium text-xs leading-relaxed">
                {m.text}
              </p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-stone-100 p-3 bg-stone-50/50">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your message..."
          className="h-10 flex-1 rounded-xl border border-stone-200 bg-white px-3.5 text-xs font-semibold outline-none focus:border-[#9E0C25]"
        />
        <button
          onClick={send}
          disabled={!text.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9E0C25] text-white hover:bg-[#800A1E] transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}