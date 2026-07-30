"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Upload,
  ArrowRight,
  ChevronLeft,
  Lock,
  ChevronDown,
  Phone,
  BookOpen,
  Users,
  CreditCard,
  Check,
  ShieldCheck,
  Calendar,
  CheckCircle2
} from "lucide-react";

// Font stacks matching Figma spec exactly.
// Make sure Plus Jakarta Sans + Inter are loaded via next/font or a <link> tag in layout.tsx
const fontJakarta = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const fontInter = { fontFamily: "'Inter', sans-serif" };

// Returns today's date as yyyy-mm-dd, used to restrict Joining Date to today or later
const getTodayDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function StudentEnrollPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1 FIELDS
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // STEP 2 FIELDS
  const [course, setCourse] = useState("Kathak");
  const [skillLevel, setSkillLevel] = useState("Beginner (Prathama)");
  const [batch, setBatch] = useState("Morning Zen (7:00 AM)");
  const [joiningDate, setJoiningDate] = useState("");
  const [isUnder18, setIsUnder18] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [relationship, setRelationship] = useState("Mother");
  const [emergencyContact, setEmergencyContact] = useState("");

  // STEP 3 FIELDS
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [autoBilling, setAutoBilling] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteEnrollment = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      router.push("/student/dashboard");
    }, 1200);
  };

  return (
    // Figma Frame: Fill #FFFFFF, Corner radius 0
    <div className="min-h-screen relative bg-white text-stone-900 flex flex-col justify-between selection:bg-[#C10F3A] selection:text-white overflow-x-hidden">

      {/* Background Image Layer with Translucent Vignette */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/adminlogin.png"
          alt="Kathak Feet Background"
          className="w-full h-full object-cover object-center filter grayscale opacity-100 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-white/50" />
      </div>

      {/* Main Container (Width 1280 max) */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">

        {/* Back to Login — only on Step 1 */}
        {currentStep === 1 && (
          <Link
            href="/student/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-[#C10F3A] transition-colors mb-4 w-fit"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        )}

        {/* Top Header Title & Subtitle */}
        <div className="mb-8 text-left space-y-1">
          {/* Figma: Plus Jakarta Sans, Bold, 24px, line-height 31.2, Fill #C10F3A */}
          <h1
            className="font-bold text-2xl tracking-tight text-[#C10F3A]"
            style={{ ...fontJakarta, lineHeight: "31.2px" }}
          >
            Student Enrollment
          </h1>
          {/* Figma: Inter, Regular, 16px, line-height 25.6, Fill #464555 */}
          <p
            className="text-base font-normal"
            style={{ ...fontInter, color: "#464555", lineHeight: "25.6px" }}
          >
            Register a new student for the 2024 Academic Session.
          </p>
        </div>

        {/* STEPPER PROGRESS INDICATOR (Step 1 -> Step 2 -> Step 3) */}
        <div className="mb-10 max-w-2xl mx-auto w-full px-4">
          <div className="relative flex items-center justify-between">
            {/* Connecting Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-stone-300 z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#C10F3A] transition-all duration-300 z-0"
              style={{
                width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
              }}
            />

            {/* STEP 1 */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                  currentStep >= 1
                    ? "bg-[#C10F3A] text-white ring-4 ring-rose-100"
                    : "bg-white border-2 border-stone-300 text-stone-400"
                }`}
              >
                {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              {/* Figma: Inter, Bold, 16px, Fill #C10F3A (active) */}
              <span
                className={`text-base font-bold whitespace-nowrap ${
                  currentStep >= 1 ? "text-[#C10F3A]" : "text-stone-400"
                }`}
                style={fontInter}
              >
                {currentStep === 3 ? "Basic Info" : "Personal Info"}
              </span>
            </div>

            {/* STEP 2 */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStep >= 2
                    ? "bg-[#C10F3A] text-white ring-4 ring-rose-100"
                    : "bg-white border-2 border-stone-300 text-stone-400"
                }`}
              >
                {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
              </div>
              <span
                className={`text-base font-bold whitespace-nowrap ${
                  currentStep >= 2 ? "text-[#C10F3A]" : "text-stone-400"
                }`}
                style={fontInter}
              >
                {currentStep === 3 ? "Course Selection" : "Enrollment Details"}
              </span>
            </div>

            {/* STEP 3 */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStep >= 3
                    ? "bg-[#C10F3A] text-white ring-4 ring-rose-100"
                    : "bg-white border-2 border-stone-300 text-stone-400"
                }`}
              >
                3
              </div>
              <span
                className={`text-base font-bold whitespace-nowrap ${
                  currentStep >= 3 ? "text-[#C10F3A]" : "text-stone-400"
                }`}
                style={fontInter}
              >
                {currentStep === 3 ? "Payment Setup" : "Payment"}
              </span>
            </div>
          </div>
        </div>

        {/* STEP 1 FORM: PERSONAL INFO */}
        {currentStep === 1 && (
          <form onSubmit={handleNext} className="space-y-6 max-w-4xl mx-auto w-full">

            {/* CARD 1: PERSONAL INFORMATION — Figma: Fill #FFFFFF 70%, Stroke #FFFFFF 40%, radius 16 */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">

              {/* Top Left Red Pill Header Badge — Figma: Plus Jakarta Sans SemiBold 18px, Fill #C10F3A */}
              <div className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide" style={fontJakarta}>
                <User className="w-4 h-4 text-[#C10F3A]" />
                <span>Personal Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">

                {/* Photo Upload */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <div className="relative w-full max-w-[180px] aspect-square rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/40 hover:bg-sky-50/80 transition-colors flex flex-col items-center justify-center p-4 text-center group cursor-pointer overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    />

                    {profileImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-500 mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-medium text-stone-500 leading-tight">
                          Upload high-res JPG or PNG
                        </span>
                      </>
                    )}

                    <div className="absolute bottom-2 right-2 z-10 bg-[#C10F3A] text-white p-1 rounded-md shadow-xs">
                      <Lock className="w-3 h-3" />
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-2">Profile Photo</span>
                </div>

                {/* Form Inputs */}
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Advika Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Gender
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none appearance-none cursor-pointer shadow-2xs"
                        >
                          <option value="">Select Gender</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* CARD 2: CONTACT DETAILS */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
              <div className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide" style={fontJakarta}>
                <Mail className="w-4 h-4 text-[#C10F3A]" />
                <span>Contact Details</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="example@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="bg-stone-50 border border-stone-200 text-stone-600 px-3 py-2.5 rounded-xl text-xs font-semibold shrink-0">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Street, Apartment, Locality, City, State, ZIP"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="bg-[#C10F3A] hover:bg-[#A01830] text-white px-8 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer group"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2 FORM: ENROLLMENT DETAILS & PARENT/GUARDIAN INFO */}
        {currentStep === 2 && (
          <form onSubmit={handleNext} className="space-y-6 max-w-4xl mx-auto w-full">

            {/* CARD 1: ENROLLMENT DETAILS */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
              <div className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide" style={fontJakarta}>
                <BookOpen className="w-4 h-4 text-[#C10F3A]" />
                <span>Enrollment Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Course Selection
                  </label>
                  <div className="relative">
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none appearance-none cursor-pointer shadow-2xs"
                    >
                      <option value="Kathak">Kathak</option>
                      <option value="Kathak Jaipur Gharana">Kathak Jaipur Gharana</option>
                      <option value="Classical Mudras">Classical Mudras</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Skill Level
                  </label>
                  <div className="relative">
                    <select
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none appearance-none cursor-pointer shadow-2xs"
                    >
                      <option value="Beginner (Prathama)">Beginner (Prathama)</option>
                      <option value="Intermediate (Praveshika)">Intermediate (Praveshika)</option>
                      <option value="Advanced (Madhyama)">Advanced (Madhyama)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Batch Assignment
                  </label>
                  <div className="relative">
                    <select
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none appearance-none cursor-pointer shadow-2xs"
                    >
                      <option value="Morning Zen (7:00 AM)">Morning Zen (7:00 AM)</option>
                      <option value="Evening Batch (5:00 PM)">Evening Batch (5:00 PM)</option>
                      <option value="Weekend Batch (10:00 AM)">Weekend Batch (10:00 AM)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    required
                    min={getTodayDateString()}
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: PARENT / GUARDIAN INFO */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
              <div className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide" style={fontJakarta}>
                <Users className="w-4 h-4 text-[#C10F3A]" />
                <span>Parent / Guardian Info</span>
              </div>

              <div className="space-y-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 font-medium">
                  <input
                    type="checkbox"
                    checked={isUnder18}
                    onChange={(e) => setIsUnder18(e.target.checked)}
                    className="rounded border-stone-300 text-[#C10F3A] focus:ring-0"
                  />
                  <span>Check if student is under 18 years of age</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Guardian Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Relationship
                    </label>
                    <div className="relative">
                      <select
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none appearance-none cursor-pointer shadow-2xs"
                      >
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Guardian">Guardian</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handlePrev}
                className="text-stone-600 hover:text-[#C10F3A] font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>‹ Previous</span>
              </button>

              <button
                type="submit"
                className="bg-[#C10F3A] hover:bg-[#A01830] text-white px-8 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer group"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 FORM: PAYMENT SETUP & KINETIC LEDGER */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-4xl mx-auto w-full">

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

              {/* LEFT COLUMN: KINETIC LEDGER SUMMARY */}
              <div className="md:col-span-5 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/40 space-y-5">

                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold" style={fontJakarta}>
                    <BookOpen className="w-4 h-4" />
                    <span>Kinetic Ledger</span>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">
                    Pending Enrollment
                  </span>
                </div>

                <div className="space-y-3 pt-1 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                    <div>
                      <span className="font-semibold text-stone-800 block">Registration Fee</span>
                      <span className="text-[10px] text-stone-400">One-time admission charge</span>
                    </div>
                    <span className="font-bold text-stone-800">₹2,500</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                    <div>
                      <span className="font-semibold text-stone-800 block">Monthly Tuition</span>
                      <span className="text-[10px] text-stone-400">Course: Kathak Foundation</span>
                    </div>
                    <span className="font-bold text-stone-800">₹4,000</span>
                  </div>
                </div>

                {/* HIGHLIGHTED TOTAL BOX */}
                <div className="bg-[#FDF2F4] border border-[#F8D7DA] p-4 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-xs text-[#C10F3A] uppercase tracking-wider">
                    Total Amount Due
                  </span>
                  <span className="font-extrabold text-2xl text-[#C10F3A]">
                    ₹6,500
                  </span>
                </div>

                {/* AUTOMATED BILLING TOGGLE */}
                <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-stone-800 block text-[11px]">Automated Monthly Billing</span>
                    <span className="text-[10px] text-stone-400">Invoices generated automatically every 1st</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoBilling(!autoBilling)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                      autoBilling ? "bg-[#C10F3A]" : "bg-stone-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        autoBilling ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN: SELECT PAYMENT METHOD */}
              <div className="md:col-span-7 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/40 space-y-5">

                <h3 className="font-bold text-xs text-stone-800 uppercase tracking-wider">
                  Select Payment Method
                </h3>

                <div className="space-y-3">

                  {/* OPTION 1: UPI TRANSFER */}
                  <label
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "upi"
                        ? "border-[#C10F3A] bg-[#FDF2F4]/40"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-xs">
                        <img src="/icons/qr.png" alt="UPI" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-800 block">UPI Transfer</span>
                        <span className="text-[10px] text-stone-400">GPay, PhonePe, Paytm</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="accent-[#C10F3A]"
                    />
                  </label>

                  {/* OPTION 2: CREDIT / DEBIT CARD */}
                  <label
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-[#C10F3A] bg-[#FDF2F4]/40"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-xs">
                        <img src="/icons/card.png" alt="Card" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-800 block">Credit / Debit Card</span>
                        <span className="text-[10px] text-stone-400">Visa, Mastercard, RuPay</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="accent-[#C10F3A]"
                    />
                  </label>

                </div>

                {/* SECURITY NOTICE */}
                <div className="bg-sky-50/70 border border-sky-200 p-3.5 rounded-xl flex items-start gap-2.5 text-[11px] text-sky-800">
                  <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    All transactions are encrypted and recorded in the Academy&apos;s secure financial database.
                  </span>
                </div>

              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="text-stone-600 hover:text-[#C10F3A] font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>‹ Previous</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-5 py-3 rounded-xl font-semibold text-xs transition-all cursor-pointer"
                >
                  Save for Later
                </button>

                <button
                  type="button"
                  onClick={handleCompleteEnrollment}
                  disabled={isSubmitted}
                  className="bg-[#C10F3A] hover:bg-[#A01830] text-white px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitted ? (
                    <span>Processing Enrollment...</span>
                  ) : (
                    <>
                      <span>Complete Enrollment</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Page Footer */}
      <footer className="relative z-10 text-center py-4 text-stone-500 text-xs">
        © {new Date().getFullYear()} Kathak by Harshita. All rights reserved.
      </footer>
    </div>
  );
}