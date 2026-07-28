"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function GetInTouchSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    contactInfo: "",
    classMode: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for reaching out! We will get in touch with you shortly.");
  };

  return (
    <section id="contact" className="relative w-full bg-white py-14 sm:py-16 lg:py-20 text-stone-900 overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Main Grid: Left Image Banner & Right Form Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: Image with Bottom-Right Overlay Box */}
          <div className="lg:col-span-6 relative min-h-[420px] sm:min-h-[480px] lg:min-h-[580px] rounded-3xl overflow-hidden shadow-md group border border-stone-200/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/getintouch.jpeg"
              alt="Kathak Dancers Group - Get In Touch"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />

            {/* large Container: #6c867e with lower opacity & Corner Radius: 0 (rounded-none) */}
            <div className="absolute bottom-0 right-0 bg-[#1F4A3A]/60 backdrop-blur-xs p-3.5 sm:p-4 rounded-none shadow-xl max-w-[391px]">
              {/* Chota Container: #37523f with higher opacity & Corner Radius: 0 (rounded-none) */}
             <div className="bg-[#1F4A3A]/60 pl-1 pt-0 pb-5 px-5 rounded-none text-white shadow-md border border-white/10">
                {/* Inter Medium 16px white */}
             <span className="block font-inter text-[16px] font-medium leading-[19px] mb-3">
  Have Any Questions?
</span>

<h3 className="font-inter text-[32px] font-semibold leading-[38px]">
  We'd Love to Hear <br />
  From You
</h3>
              </div>
            </div>
          </div>

          {/* Right Column: Light Muted Beige Form Card */}
          <div className="lg:col-span-6 bg-[#F7EFE5] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-stone-200/50 flex flex-col justify-center">
            
            {/* Form Header */}
            <div className="text-center space-y-1 mb-6 sm:mb-8">
              <h2 className="font-playfair text-[32px] font-medium leading-[48px] tracking-[0px] text-[#1F4A3A]">
                Get in Touch
              </h2>
              <p className="font-sans text-[13px] md:text-[14px] font-normal leading-[20px] tracking-normal text-[#6B7280]">
                Start Your Kathak Journey With Us
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5 w-full max-w-lg mx-auto">
              
              {/* 1. Full Name */}
              <div>
             <input
  type="text"
  required
  placeholder="Full Name"
  value={formData.fullName}
  onChange={(e) =>
    setFormData({ ...formData, fullName: e.target.value })
  }
  className="w-full h-[60px] rounded-xl bg-white px-7 text-[16px] leading-[24px] font-normal font-['Plus_Jakarta_Sans'] text-black placeholder:text-black border-0 outline-none shadow-none focus:ring-0 focus:outline-none
  "
/>
              </div>

              {/* 2. Email / Phone Number */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="Email / Phone Number"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  className="w-full h-[60px] rounded-xl bg-white px-7 text-[16px] leading-[24px] font-normal font-['Plus_Jakarta_Sans'] text-black placeholder:text-black border-0 outline-none shadow-none focus:ring-0 focus:outline-none"
                />
              </div>

              {/* 3. Class Mode Dropdown */}
              <div>
                <select
                  required
                  value={formData.classMode}
                  onChange={(e) => setFormData({ ...formData, classMode: e.target.value })}
                  className="w-full h-[60px] rounded-xl bg-white px-7 text-[16px] leading-[24px] font-normal font-['Plus_Jakarta_Sans'] text-black placeholder:text-black border-0 outline-none shadow-none focus:ring-0 focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Class Mode
                  </option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* 4. Subject Dropdown */}
              <div>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full h-[60px] rounded-xl bg-white px-7 text-[16px] leading-[24px] font-normal font-['Plus_Jakarta_Sans'] text-black placeholder:text-black border-0 outline-none shadow-none focus:ring-0 focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Subject
                  </option>
                  <option value="Beginner – Foundation Level (Structured Diploma Path)">
                    Beginner – Foundation Level (Structured Diploma Path)
                  </option>
                  <option value="Beginner – Prarambhik Batch (Flexible Hobby Learning)">
                    Beginner – Prarambhik Batch (Flexible Hobby Learning)
                  </option>
                  <option value="Intermediate – Foundation Level (Structured Program)">
                    Intermediate – Foundation Level (Structured Program)
                  </option>
                  <option value="Intermediate – Madhyamik Batch (Creative Practice)">
                    Intermediate – Madhyamik Batch (Creative Practice)
                  </option>
                  <option value="Advanced – Foundation Level (Visharad / Bhaskar Track)">
                    Advanced – Foundation Level (Visharad / Bhaskar Track)
                  </option>
                  <option value="Advanced – Praveen Batch (Professional Mastery)">
                    Advanced – Praveen Batch (Professional Mastery)
                  </option>
                  <option value="Competition Judging">Competition Judging</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* 5. Your Message Textarea */}
              <div>
                <textarea
                  rows={3}
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full h-[80px] rounded-xl bg-white px-7 py-7 text-[16px] leading-[24px] font-normal font-['Plus_Jakarta_Sans'] text-black placeholder:text-black border-0 outline-none shadow-none focus:ring-0 focus:outline-none"
                />
              </div>

              {/* 6. Send Button */}
              <div className="pt-2">
              <button
  type="submit"
  className="
    w-full
    h-[60px]
    rounded-xl
    bg-[#C10F3A]
    text-white
    font-['Plus_Jakarta_Sans']
    text-[24px]
    font-semibold
    leading-[24px]
    flex
    items-center
    justify-center
    gap-2
    transition-colors
    hover:bg-[#A01830]
    cursor-pointer
  "
>
  <span>Send</span>
  <ArrowRight className="w-6 h-6" />
</button>
              </div>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}
