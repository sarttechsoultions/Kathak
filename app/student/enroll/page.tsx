"use client";

import React, { useState, useEffect, useRef } from "react";
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
  CheckCircle2,
  Film,
  Play,
  X,
  Eye,
  EyeOff,
  Info,
  Sparkles
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";

// Font stacks matching Figma spec exactly.
const fontJakarta = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const fontInter = { fontFamily: "'Inter', sans-serif" };

// Returns today's date as yyyy-mm-dd
const getTodayDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Video URL Formatter Helper
function getEmbedVideoUrl(url: string): { isIframe: boolean; finalUrl: string } {
  if (!url) return { isIframe: false, finalUrl: "" };
  let cleanUrl = url.trim();

  // YouTube watch URL -> embed URL
  if (cleanUrl.includes("youtube.com/watch?v=")) {
    const videoId = cleanUrl.split("v=")[1]?.split("&")[0];
    return { isIframe: true, finalUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1` };
  }
  if (cleanUrl.includes("youtu.be/")) {
    const videoId = cleanUrl.split("youtu.be/")[1]?.split("?")[0];
    return { isIframe: true, finalUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1` };
  }

  // Vimeo URL -> embed URL
  if (cleanUrl.includes("vimeo.com/") && !cleanUrl.includes("player.vimeo.com")) {
    const videoId = cleanUrl.split("vimeo.com/")[1]?.split("?")[0];
    return { isIframe: true, finalUrl: `https://player.vimeo.com/video/${videoId}` };
  }

  // Bunny Stream / iframe URL
  if (cleanUrl.includes("mediadelivery.net") || cleanUrl.includes("b-cdn.net") || cleanUrl.includes("iframe")) {
    return { isIframe: true, finalUrl: cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}` };
  }

  // Direct MP4 / Cloudinary video URL
  return { isIframe: false, finalUrl: cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}` };
}

export default function StudentEnrollPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // DYNAMIC COURSES FROM DATABASE
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoModalContainerRef = useRef<HTMLDivElement>(null);

  // STEP 1 FIELDS
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // STEP 2 FIELDS
  const [course, setCourse] = useState("Kathak Beginners Course");
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

  // Fetch dynamic courses from PostgreSQL DB on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiRequest(ENDPOINTS.COURSES);
        if (res.data?.courses && res.data.courses.length > 0) {
          setDbCourses(res.data.courses);
          setCourse(res.data.courses[0].title);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Screen Recording & Screenshot Protection for Video Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showVideoModal) {
        if (e.key === "PrintScreen" || e.keyCode === 44) {
          e.preventDefault();
          alert("Screen capturing is disabled for copyright protection.");
          return false;
        }
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j")) ||
          (e.ctrlKey && (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S"))
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showVideoModal]);

  const selectedCourseObj = dbCourses.find((c) => c.title === course) || dbCourses[0];

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
    if (currentStep === 1) {
      if (!password || password.length < 6) {
        alert("Please create a portal password with at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match. Please re-enter matching passwords.");
        return;
      }
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteEnrollment = async () => {
    setIsSubmitted(true);
    try {
      const res = await apiRequest(ENDPOINTS.STUDENT_ENROLL, {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          dob,
          gender,
          address,
          profileImage,
          courseTitle: course,
          courseId: selectedCourseObj?.id,
          skillLevel,
          batch,
          joiningDate,
          isUnder18,
          guardianName,
          relationship,
          emergencyContact,
          paymentMethod,
          groupFeeINR: selectedCourseObj?.groupFeeINR || 2200,
          groupFeeUSD: selectedCourseObj?.groupFeeUSD || 50
        })
      });

      if (res.data?.token) {
        localStorage.setItem("kathak_token", res.data.token);
        if (res.data.user) {
          localStorage.setItem("kathak_student_user", JSON.stringify(res.data.user));
        }
      }

      await openThemeSuccess(
        `Congratulations ${fullName}! Your enrollment for "${course}" is complete. Redirecting to your Student Portal...`,
        "Enrollment & Course Unlocked"
      );

      router.push("/student/dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to complete enrollment.");
      setIsSubmitted(false);
    }
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
          <h1
            className="font-bold text-2xl tracking-tight text-[#C10F3A]"
            style={{ ...fontJakarta, lineHeight: "31.2px" }}
          >
            Student Enrollment
          </h1>
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

            {/* CARD 1: PERSONAL INFORMATION */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
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

            {/* CARD 3: ACCOUNT SECURITY & PORTAL PASSWORD SETUP */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
              <div className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide" style={fontJakarta}>
                <Lock className="w-4 h-4 text-[#C10F3A]" />
                <span>Account Security & Portal Password Setup</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Create Portal Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl pl-10 pr-10 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl pl-10 pr-10 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200 flex items-center gap-2.5 text-[11.5px] text-sky-800 font-medium">
                  <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Use this password along with your Email address to sign in to the Student Portal anytime.</span>
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

        {/* STEP 2 FORM: DYNAMIC ENROLLMENT DETAILS & PROMOTIONAL VIDEO PREVIEW */}
        {currentStep === 2 && (
          <form onSubmit={handleNext} className="space-y-6 max-w-4xl mx-auto w-full">

            {/* CARD 1: DYNAMIC ENROLLMENT DETAILS */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
              <div className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide" style={fontJakarta}>
                <BookOpen className="w-4 h-4 text-[#C10F3A]" />
                <span>Enrollment Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* 100% DYNAMIC COURSE SELECTION DROPDOWN FROM POSTGRESQL DB */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Course Selection (100% Dynamic from Database)
                  </label>
                  <div className="relative">
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs font-bold text-stone-800 focus:outline-none appearance-none cursor-pointer shadow-2xs"
                    >
                      {dbCourses.length > 0 ? (
                        dbCourses.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} — ({c.level || "Beginner"})
                          </option>
                        ))
                      ) : (
                        <option value="Kathak Beginners Course">Kathak Beginners Course</option>
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* SELECTED COURSE PROMOTIONAL VIDEO & SPECIFICATION BANNER CARD */}
                {selectedCourseObj && (
                  <div className="sm:col-span-2 p-4 rounded-2xl bg-[#FDF2F4] border border-rose-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#C10F3A] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#0B1C30]">
                            {selectedCourseObj.title}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-[#C10F3A]">
                            {selectedCourseObj.level || "Beginner"}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 font-medium mt-0.5">
                          Group Fee: ₹{selectedCourseObj.groupFeeINR || selectedCourseObj.feeINR || "2,200"}/mo (USD ${selectedCourseObj.groupFeeUSD || 50}) • {selectedCourseObj.duration || "10 Classes/month"}
                        </p>
                      </div>
                    </div>

                    {selectedCourseObj.videoUrl ? (
                      <button
                        type="button"
                        onClick={() => setShowVideoModal(true)}
                        className="px-4 py-2 rounded-xl bg-[#C10F3A] hover:bg-[#A01830] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
                      >
                        <Film className="w-4 h-4 text-white" />
                        <span>Watch Course Demo Video</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-stone-400 font-medium italic">
                        No promotional video attached
                      </span>
                    )}
                  </div>
                )}

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

                <div className="sm:col-span-2">
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
                      placeholder="+91 98765 43210"
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
                className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <button
                type="submit"
                className="bg-[#C10F3A] hover:bg-[#A01830] text-white px-8 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer group"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 FORM: PAYMENT SETUP */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
              <div className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide" style={fontJakarta}>
                <CreditCard className="w-4 h-4 text-[#C10F3A]" />
                <span>Payment Setup</span>
              </div>

              {/* ENROLLMENT SUMMARY CARD */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <h4 className="font-bold text-sm text-stone-900">Enrollment Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Selected Course</span>
                    <span className="font-bold text-[#C10F3A]">{course}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">Assigned Batch</span>
                    <span className="font-bold text-stone-800">{batch}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">Monthly Fee</span>
                    <span className="font-bold text-stone-900">₹{selectedCourseObj?.groupFeeINR || "2,200"} / month</span>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD SELECTOR */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-stone-700">Select Payment Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      paymentMethod === "upi"
                        ? "border-[#C10F3A] bg-[#FDF2F4] shadow-2xs"
                        : "border-stone-200 bg-white hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-[#C10F3A] flex items-center justify-center font-bold text-xs">
                        UPI
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-800 block">GPay / PhonePe / Paytm</span>
                        <span className="text-[10.5px] text-stone-500">Instant UPI Auto-Pay</span>
                      </div>
                    </div>
                    {paymentMethod === "upi" && <CheckCircle2 className="w-5 h-5 text-[#C10F3A]" />}
                  </div>

                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      paymentMethod === "card"
                        ? "border-[#C10F3A] bg-[#FDF2F4] shadow-2xs"
                        : "border-stone-200 bg-white hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                        CARD
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-800 block">Credit / Debit Card</span>
                        <span className="text-[10.5px] text-stone-500">Visa, Mastercard, RuPay</span>
                      </div>
                    </div>
                    {paymentMethod === "card" && <CheckCircle2 className="w-5 h-5 text-[#C10F3A]" />}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800 font-semibold">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>256-Bit SSL Encrypted Secure Payment Gateway</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handlePrev}
                className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <button
                type="button"
                onClick={handleCompleteEnrollment}
                disabled={isSubmitted}
                className="bg-[#C10F3A] hover:bg-[#A01830] text-white px-8 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>{isSubmitted ? "Processing Registration..." : "Complete Registration & Pay"}</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* PROMOTIONAL VIDEO PREVIEW MODAL (With Kathak Logo Watermark & Anti-Piracy Protection) */}
      {showVideoModal && selectedCourseObj?.videoUrl && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            ref={videoModalContainerRef}
            className="relative w-full max-w-4xl bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-700 flex flex-col"
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#C10F3A] text-white flex items-center justify-center font-bold">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedCourseObj.title}</h3>
                  <span className="text-[11px] text-stone-400 font-medium">Promotional Demo Video</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Frame with Kathak Logo Watermark Overlay */}
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="relative w-full aspect-video bg-black overflow-hidden select-none"
            >
              {/* Pure Kathak Logo Watermark Badge (Top Right) */}
              <div className="absolute top-4 right-4 z-50 pointer-events-none select-none drop-shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Kathak Logo"
                  className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] opacity-90"
                />
              </div>

              {/* Anti-Piracy Floating Watermark (Bottom Left) */}
              <div className="absolute bottom-4 left-4 z-50 pointer-events-none text-white/50 text-[10px] font-bold uppercase tracking-widest select-none drop-shadow-md">
                Protected Demo • Kathak Next
              </div>

              {(() => {
                const videoData = getEmbedVideoUrl(selectedCourseObj.videoUrl);
                if (videoData.isIframe) {
                  return (
                    <iframe
                      src={videoData.finalUrl}
                      loading="lazy"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }
                return (
                  <video
                    src={videoData.finalUrl}
                    controls
                    autoPlay
                    preload="auto"
                    playsInline
                    controlsList="nodownload noremoteplayback"
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-cover"
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Page Footer */}
      <footer className="relative z-10 text-center py-4 text-stone-500 text-xs">
        © {new Date().getFullYear()} Kathak by Harshita. All rights reserved.
      </footer>
    </div>
  );
}