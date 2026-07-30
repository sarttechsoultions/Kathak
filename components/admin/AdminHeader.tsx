"use client";

import React from "react";
import { Search, Bell, Menu } from "lucide-react";

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

export default function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  return (
    <header className="h-[72px] bg-white border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      
      <div className="flex items-center gap-3 w-full max-w-md">
        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer shrink-0"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search lessons, progress, or teachers..."
            className="w-full h-10 pl-10 pr-4 rounded-full bg-stone-100/80 text-xs sm:text-sm font-medium text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9E0C25]/20 border border-stone-200/60 transition-all"
          />
        </div>
      </div>

      {/* Right Admin User Profile */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0 pl-2">
        <button className="p-2 rounded-full hover:bg-stone-100 relative text-stone-600 transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-[#9E0C25] absolute top-1.5 right-1.5" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
          <div className="w-9 h-9 rounded-full bg-stone-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
            A
          </div>
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-bold text-stone-900 leading-tight">Admin User</h4>
            <p className="text-[10px] font-semibold text-stone-500">Head of Faculty</p>
          </div>
        </div>
      </div>

    </header>
  );
}
