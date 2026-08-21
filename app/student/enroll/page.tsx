"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import type { Country as PhoneCountryCode } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Country, State, City } from "country-state-city";
import type { ICountry, IState, ICity } from "country-state-city";
import {
  Mail,
  Upload,
  ArrowRight,
  ChevronLeft,
  Lock,
  ChevronDown,
  BookOpen,
  Check,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  X,
  User,
  Film,
  Users,
  CreditCard,
  Loader2,
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { persistAuthSession } from "@/lib/auth";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";

// Font stacks matching Figma spec exactly.
const fontJakarta = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const fontInter = { fontFamily: "'Inter', sans-serif" };

// Returns today's date as yyyy-mm-dd (Used for auto-capturing joining date)
const getTodayDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getMaxDobDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear() - 3;
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getMinDobDate = () => {
  return "1920-01-01";
};

const isValidPhone = (value: string | undefined) =>
  !!value && isValidPhoneNumber(value);

const getAgeFromDob = (value: string): number | null => {
  if (!value) return null;
  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Video URL Formatter Helper
function getEmbedVideoUrl(url: string): { isIframe: boolean; finalUrl: string } {
  if (!url) return { isIframe: false, finalUrl: "" };
  const cleanUrl = url.trim();

  if (cleanUrl.includes("youtube.com/watch?v=")) {
    const videoId = cleanUrl.split("v=")[1]?.split("&")[0];
    return {
      isIframe: true,
      finalUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
    };
  }
  if (cleanUrl.includes("youtu.be/")) {
    const videoId = cleanUrl.split("youtu.be/")[1]?.split("?")[0];
    return {
      isIframe: true,
      finalUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
    };
  }
  if (cleanUrl.includes("vimeo.com/") && !cleanUrl.includes("player.vimeo.com")) {
    const videoId = cleanUrl.split("vimeo.com/")[1]?.split("?")[0];
    return {
      isIframe: true,
      finalUrl: `https://player.vimeo.com/video/${videoId}`,
    };
  }
  if (
    cleanUrl.includes("mediadelivery.net") ||
    cleanUrl.includes("b-cdn.net") ||
    cleanUrl.includes("iframe")
  ) {
    return {
      isIframe: true,
      finalUrl: cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`,
    };
  }
  return {
    isIframe: false,
    finalUrl: cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`,
  };
}

export default function StudentEnrollPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  type BatchOption = {
    id: string;
    name: string;
    schedule?: string;
    courseId?: string;
    courseName?: string;
  };

  type Course = {
    id: string;
    title: string;
    groupFeeINR?: number;
    groupFeeUSD?: number;
    level?: string;
    feeINR?: number;
    duration?: string;
    videoUrl?: string;
    batches?: BatchOption[];
  };

  const [dbCourses, setDbCourses] = useState<Course[]>([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoModalContainerRef = useRef<HTMLDivElement>(null);

  // STEP 1 FIELDS
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Country / State / City
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(
    Country.getCountryByCode("IN") || null
  );
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);

  const states = useMemo(
    () => (selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []),
    [selectedCountry]
  );
  const cities = useMemo(
    () =>
      selectedCountry && selectedState
        ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
        : [],
    [selectedCountry, selectedState]
  );

  // Validation errors
  const [phoneError, setPhoneError] = useState("");
  const [regionError, setRegionError] = useState("");
  const [cityError, setCityError] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailOtpHint, setEmailOtpHint] = useState("");
  const [mobileOtpHint, setMobileOtpHint] = useState("");
  const [otpBusy, setOtpBusy] = useState<"email" | "mobile" | null>(null);

  // STEP 2 FIELDS
  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [isUnder18, setIsUnder18] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [relationship, setRelationship] = useState("Mother");
  const [emergencyContact, setEmergencyContact] = useState("");

  // STEP 3 FIELDS
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch dynamic courses & batches from PostgreSQL DB on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiRequest<{
          data?: {
            courses?: Course[];
          };
        }>(ENDPOINTS.PUBLIC_COURSES);
        
        if (res.data?.courses && res.data.courses.length > 0) {
          setDbCourses(res.data.courses);
          const firstCourse = res.data.courses[0];
          setCourseId(firstCourse.id);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch dynamic courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const selectedCourseObj = useMemo(
    () => dbCourses.find((c) => c.id === courseId) || dbCourses[0] || null,
    [courseId, dbCourses]
  );

  // Filter batches based on 10-days rule, Upcoming status, AND STRICT COURSE MATCH
  const availableBatches = useMemo(() => {
    if (!selectedCourseObj?.batches) return [];
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return selectedCourseObj.batches.filter((batch) => {
      if (batch.courseId && batch.courseId !== selectedCourseObj.id) {
        return false;
      }

      if (!batch.schedule || !batch.schedule.includes("|")) return true;
      
      const parts = batch.schedule.split("|");
      const startDateStr = parts[2];
      const endDateStr = parts[3];

      if (endDateStr) {
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999);
        if (endDate < now) return false; 
      }

      if (startDateStr) {
        const startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0);

        if (startDate > now) return true; 

        const diffTime = now.getTime() - startDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= 10;
      }

      return true;
    });
  }, [selectedCourseObj]);

  // Auto-select first available batch when course changes
  useEffect(() => {
    const autoSelectBatch = async () => {
      await Promise.resolve();
      if (availableBatches.length > 0) {
        setBatchId(availableBatches[0].id);
      } else {
        setBatchId("");
      }
    };
    autoSelectBatch();
  }, [availableBatches]);

  const selectedBatch = useMemo(
    () => availableBatches.find((item) => item.id === batchId) || availableBatches[0] || null,
    [batchId, availableBatches]
  );

  // Screen Recording & Screenshot Protection
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
          (e.ctrlKey &&
            e.shiftKey &&
            (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j")) ||
          (e.ctrlKey &&
            (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S"))
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showVideoModal]);


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const base =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
        "http://localhost:5000/api/v1";

      const res = await fetch(`${base}/upload/image/public`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.status === "error") {
        throw new Error(data.message || "Failed to upload image");
      }

      setProfileImage(data.data?.url || data.data?.secure_url);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Image upload failed";
      alert(message);
      setProfileImage(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const sendOtp = async (channel: "EMAIL" | "MOBILE") => {
    try {
      if (channel === "EMAIL" && !email.trim()) {
        alert("Enter your email address first.");
        return;
      }
      if (channel === "MOBILE" && !isValidPhone(phone)) {
        alert("Enter a valid mobile number first.");
        return;
      }
      setOtpBusy(channel === "EMAIL" ? "email" : "mobile");
      const res = await apiRequest(ENDPOINTS.STUDENT_OTP_SEND, {
        method: "POST",
        body: JSON.stringify({
          channel,
          email,
          phone,
          countryCode: selectedCountry ? `+${selectedCountry.phonecode}` : "+91",
        }),
      });
      if (channel === "EMAIL") {
        setEmailVerified(false);
        setEmailOtpHint(res.message || "Use OTP 001122 to verify your email.");
        setEmailOtp(res.data?.bypassCode || "001122");
      } else {
        setMobileVerified(false);
        setMobileOtpHint(res.message || "Use OTP 001122 until Twilio SMS is enabled.");
        if (res.data?.bypassCode) setMobileOtp(res.data.bypassCode);
      }
    } catch (err: unknown) {
      if (channel === "EMAIL") {
        setEmailVerified(false);
        setEmailOtp("001122");
        setEmailOtpHint("Use OTP 001122 to verify your email.");
        return;
      }
      alert(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setOtpBusy(null);
    }
  };

  const verifyOtp = async (channel: "EMAIL" | "MOBILE") => {
    try {
      const code = channel === "EMAIL" ? emailOtp : mobileOtp;
      if (!code.trim()) {
        alert("Enter the OTP first.");
        return;
      }
      setOtpBusy(channel === "EMAIL" ? "email" : "mobile");
      await apiRequest(ENDPOINTS.STUDENT_OTP_VERIFY, {
        method: "POST",
        body: JSON.stringify({
          channel,
          email,
          phone,
          countryCode: selectedCountry ? `+${selectedCountry.phonecode}` : "+91",
          code,
        }),
      });
      if (channel === "EMAIL") {
        setEmailVerified(true);
        setEmailOtpHint("Email verified.");
      } else {
        setMobileVerified(true);
        setMobileOtpHint("Mobile number verified.");
      }
    } catch (err: unknown) {
      if (channel === "EMAIL") setEmailVerified(false);
      else setMobileVerified(false);
      alert(err instanceof Error ? err.message : "Invalid OTP.");
    } finally {
      setOtpBusy(null);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      const hasValidPhone = isValidPhone(phone);
      const hasStreetAddress = address.trim().length > 0;
      const hasPostalCode = postalCode.trim().length > 0;

      setPhoneError("");
      setRegionError("");
      setCityError("");
      setPostalCodeError("");
      setAddressError("");

      if (!phone) {
        setPhoneError("Phone number is required.");
        return;
      }

      if (!hasValidPhone) {
        setPhoneError("Please enter a valid international phone number.");
        return;
      }

      if (!selectedCountry) {
        alert("Please select your country.");
        return;
      }

      if (!selectedState) {
        setRegionError("State / region is required.");
        return;
      }

      if (cities.length > 0 && !selectedCity) {
        setCityError("City is required.");
        return;
      }

      if (!hasStreetAddress) {
        setAddressError("Street address is required.");
        return;
      }

      if (!hasPostalCode) {
        setPostalCodeError("Postal / ZIP code is required.");
        return;
      }

      if (!password || password.length < 6) {
        alert("Please create a portal password with at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match. Please re-enter matching passwords.");
        return;
      }
      if (!emailVerified) {
        alert("Please verify your email with the OTP before continuing.");
        return;
      }
      if (!mobileVerified) {
        alert("Please verify your mobile number with the OTP before continuing.");
        return;
      }
    }

    if (currentStep === 2) {
      if (availableBatches.length > 0 && !batchId) {
        alert("Please select a batch assignment for this course.");
        return;
      }

      const age = getAgeFromDob(dob);
      const requiresGuardian = isUnder18 || (age !== null && age < 18);
      if (requiresGuardian) {
        if (!guardianName.trim()) {
          alert("Guardian name is required for students under 18.");
          return;
        }
        if (!emergencyContact.trim()) {
          alert("Emergency contact is required for students under 18.");
          return;
        }
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

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-checkout-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCompleteEnrollment = async () => {
    if (!batchId) {
      alert("Please select a batch before proceeding to payment.");
      return;
    }

    setSubmitError("");
    setIsSubmitted(true);
    
    try {
      const resRazorpay = await loadRazorpay();
      if (!resRazorpay) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsSubmitted(false);
        return;
      }

      const age = getAgeFromDob(dob);
      const under18 = isUnder18 || (age !== null && age < 18);

      const orderRes = await apiRequest(ENDPOINTS.CREATE_ORDER, {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          phone,
          country: selectedCountry?.name || "India",
          countryCode: selectedCountry ? `+${selectedCountry.phonecode}` : "+91",
          password,
          dob,
          gender,
          address,
          region: selectedState?.name || "",
          city: selectedCity?.name || selectedState?.name || "",
          postalCode,
          profileImage,
          courseId: selectedCourseObj?.id,
          batchId,
          joiningDate: getTodayDateString(),
          isUnder18: under18,
          guardianName,
          relationship,
          emergencyContact,
          paymentMethod: paymentMethod === "card" ? "CARD" : "UPI",
        }),
      });

      if (!orderRes || orderRes.status === "error") {
        alert(orderRes?.message || "Failed to create payment order.");
        setIsSubmitted(false);
        return;
      }

      const { orderId, amount, currency, keyId, pendingEnrollmentId } = orderRes.data;

      const options = {
        key: keyId,
        amount: amount.toString(),
        currency: currency,
        name: "Kathak Academy",
        description: `Enrollment Fee for ${selectedCourseObj?.title}`,
        image: "/logo.png",
        order_id: orderId,
        method: {
          upi: paymentMethod === "upi",
          card: paymentMethod === "card",
          netbanking: false,
          wallet: false,
          emi: false,
          paylater: false,
        },
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          try {
            let res = null;
            let lastMessage = "Registration failed after payment.";

            for (let attempt = 1; attempt <= 3; attempt++) {
              try {
                res = await apiRequest(ENDPOINTS.STUDENT_ENROLL, {
                  method: "POST",
                  body: JSON.stringify({
                    pendingEnrollmentId,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });
                break;
              } catch (retryError) {
                lastMessage = retryError instanceof Error ? retryError.message : lastMessage;
                if (attempt < 3) {
                  await sleep(1500 * attempt);
                }
              }
            }

            const token = res?.data?.token;
            const user = res?.data?.user;

            if (res?.status === "success" && token) {
              persistAuthSession({
                role: "STUDENT",
                token,
                user: user || { role: "STUDENT", fullName, email },
                rememberMe: true,
              });

              await openThemeSuccess(
                `Congratulations ${fullName}! Your enrollment for "${selectedCourseObj?.title || "your selected course"}" is complete. Redirecting to your Student Portal...`,
                "Enrollment & Course Unlocked"
              );
              router.push("/student/dashboard");
            } else {
              const paidMessage = `Payment received (ID: ${response.razorpay_payment_id}). ${lastMessage} Your account will be activated shortly — please try logging in, or contact support with this payment ID.`;
              setSubmitError(paidMessage);
              alert(paidMessage);
              setIsSubmitted(false);
            }
          } catch (error) {
            console.error(error);
            const paidMessage = `Payment received (ID: ${response.razorpay_payment_id}). We are activating your account. Please try logging in in a minute, or contact support with this payment ID.`;
            setSubmitError(paidMessage);
            alert(paidMessage);
            setIsSubmitted(false);
          }
        },
        prefill: {
          name: fullName,
          email: email,
          contact: phone || "",
          method: paymentMethod,
        },
        modal: {
          ondismiss: function () {
            setIsSubmitted(false);
          },
        },
        theme: {
          color: "#900C27",
        },
      };

      const rzp1 = new (window as unknown as { Razorpay: new (options: unknown) => { on: (event: string, callback: (response: { error: { description: string } }) => void) => void; open: () => void } }).Razorpay(options);
      
      rzp1.on("payment.failed", function (response: { error: { description: string } }) {
        alert(`Payment Failed! Reason: ${response.error.description}`);
        setIsSubmitted(false);
      });

      rzp1.open();

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message || "Failed to initiate payment.");
      setSubmitError(message || "Failed to initiate payment.");
      setIsSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-white text-stone-900 flex flex-col justify-between selection:bg-[#C10F3A] selection:text-white overflow-x-hidden">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/adminlogin.png"
          alt="Kathak Feet Background"
          className="w-full h-full object-cover object-center filter grayscale opacity-100 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-white/50" />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        {currentStep === 1 && (
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-[#C10F3A] transition-colors mb-4 w-fit"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        )}

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

        <div className="mb-10 max-w-2xl mx-auto w-full px-4">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-stone-300 z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#C10F3A] transition-all duration-300 z-0"
              style={{
                width:
                  currentStep === 1
                    ? "0%"
                    : currentStep === 2
                    ? "50%"
                    : "100%",
              }}
            />

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

        {/* STEP 1 */}
        {currentStep === 1 && (
          <form onSubmit={handleNext} className="space-y-6 max-w-4xl mx-auto w-full">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
              <div
                className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide"
                style={fontJakarta}
              >
                <User className="w-4 h-4 text-[#C10F3A]" />
                <span>Personal Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
                <div className="md:col-span-4 flex flex-col items-center">
                 <div className="relative w-full max-w-[180px] aspect-square rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/40 hover:bg-sky-50/80 transition-colors flex flex-col items-center justify-center p-4 text-center group cursor-pointer overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />

                  {isUploadingImage ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-2 border-[#C10F3A] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[11px] text-stone-500">Uploading...</span>
                    </div>
                  ) : profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-lg"
                    />
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
                  <span className="text-[10px] text-stone-400 mt-2">
                    Profile Photo
                  </span>
                </div>

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
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                        <span>Date of Birth</span>
                        <span className="text-[10px] text-[#C10F3A] font-extrabold">Min 3 Years Old</span>
                      </label>
                      <input
                        type="date"
                        required
                        min={getMinDobDate()}
                        max={getMaxDobDate()}
                        value={dob}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            const birthDate = new Date(val);
                            const today = new Date();
                            let age = today.getFullYear() - birthDate.getFullYear();
                            const m = today.getMonth() - birthDate.getMonth();
                            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                              age--;
                            }
                            if (age < 3) {
                              alert("Student must be at least 3 years old to enroll. Future dates and age under 3 years are not allowed.");
                              return;
                            }
                          }
                          setDob(val);
                        }}
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

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
              <div
                className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide"
                style={fontJakarta}
              >
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailVerified(false);
                        setEmailOtpHint("");
                      }}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                    />
                    <div className="mt-2 flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Email OTP"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="flex-1 bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => sendOtp("EMAIL")}
                        disabled={otpBusy === "email" || emailVerified}
                        className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[11px] font-bold text-stone-700 disabled:opacity-50"
                      >
                        {otpBusy === "email" ? "Sending..." : "Send OTP"}
                      </button>
                      <button
                        type="button"
                        onClick={() => verifyOtp("EMAIL")}
                        disabled={otpBusy === "email" || emailVerified}
                        className="px-3 py-2 rounded-xl bg-[#C10F3A] text-white text-[11px] font-bold disabled:opacity-50"
                      >
                        {emailVerified ? "Verified" : "Verify"}
                      </button>
                    </div>
                    {emailOtpHint ? (
                      <p className={`mt-1 text-[11px] ${emailVerified ? "text-emerald-600" : "text-stone-500"}`}>
                        {emailOtpHint}
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] text-stone-500">
                        If the email OTP does not arrive, use <span className="font-bold text-[#C10F3A]">001122</span>.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Mobile Number
                    </label>
                 <div className="bg-white border border-stone-200 rounded-xl focus-within:border-[#C10F3A] transition-colors shadow-2xs overflow-hidden">
 <PhoneInput
  international
  defaultCountry={(selectedCountry?.isoCode || "IN") as PhoneCountryCode}
  value={phone}
  onChange={(value) => {
    setPhone(value);
    setMobileVerified(false);
    setMobileOtpHint("");
  }}
  onCountryChange={(iso) => {
    if (iso) {
      const country = Country.getCountryByCode(iso);
      if (country) setSelectedCountry(country);
    }
  }}
  placeholder="Enter phone number"
  className="PhoneInput w-full"
  numberInputProps={{
    className:
      "PhoneInputInput w-full bg-transparent text-xs text-stone-800 focus:outline-none",
  }}
/>
</div>
                    <div className="mt-2 flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Mobile OTP"
                        value={mobileOtp}
                        onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="flex-1 bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => sendOtp("MOBILE")}
                        disabled={otpBusy === "mobile" || mobileVerified}
                        className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[11px] font-bold text-stone-700 disabled:opacity-50"
                      >
                        {otpBusy === "mobile" ? "Sending..." : "Send OTP"}
                      </button>
                      <button
                        type="button"
                        onClick={() => verifyOtp("MOBILE")}
                        disabled={otpBusy === "mobile" || mobileVerified}
                        className="px-3 py-2 rounded-xl bg-[#C10F3A] text-white text-[11px] font-bold disabled:opacity-50"
                      >
                        {mobileVerified ? "Verified" : "Verify"}
                      </button>
                    </div>
                    {mobileOtpHint ? (
                      <p className={`mt-1 text-[11px] ${mobileVerified ? "text-emerald-600" : "text-stone-500"}`}>
                        {mobileOtpHint}
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] text-stone-500">
                        Until Twilio SMS is added, use mobile OTP <span className="font-bold text-[#C10F3A]">001122</span>.
                      </p>
                    )}
                    {phoneError ? (
                      <p className="mt-2 text-[11px] text-rose-600">
                        {phoneError}
                      </p>
                    ) : (
                      <p className="mt-2 text-[11px] text-stone-500">
                        Selected country: {selectedCountry?.name || "India"} (+
                        {selectedCountry?.phonecode || "91"})
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Country
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCountry?.isoCode || ""}
                        onChange={(e) => {
                          const country = Country.getCountryByCode(
                            e.target.value
                          );
                          setSelectedCountry(country || null);
                        }}
                        className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none appearance-none cursor-pointer shadow-2xs"
                      >
                        <option value="">Select Country</option>
                        {Country.getAllCountries().map((c) => (
                          <option key={c.isoCode} value={c.isoCode}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      State / Region
                    </label>
                    <div className="relative">
                      <select
                        value={selectedState?.isoCode || ""}
                        onChange={(e) => {
                          const state = states.find(
                            (s) => s.isoCode === e.target.value
                          );
                          setSelectedState(state || null);
                        }}
                        disabled={!selectedCountry}
                        className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none appearance-none cursor-pointer shadow-2xs disabled:bg-stone-50 disabled:text-stone-400"
                      >
                        <option value="">Select State</option>
                        {states.map((s) => (
                          <option key={s.isoCode} value={s.isoCode}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {regionError && (
                      <p className="mt-2 text-[11px] text-rose-600">
                        {regionError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      City
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCity?.name || ""}
                        onChange={(e) => {
                          const cityObj = cities.find(
                            (c) => c.name === e.target.value
                          );
                          setSelectedCity(cityObj || null);
                        }}
                        disabled={!selectedState}
                        className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none appearance-none cursor-pointer shadow-2xs disabled:bg-stone-50 disabled:text-stone-400"
                      >
                        <option value="">Select City</option>
                        {cities.map((c) => (
                          <option key={`${c.name}-${c.latitude}`} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {cityError && (
                      <p className="mt-2 text-[11px] text-rose-600">
                        {cityError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Flat / House / Street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                    />
                    {addressError && (
                      <p className="mt-2 text-[11px] text-rose-600">
                        {addressError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="PIN or ZIP code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                    />
                    {postalCodeError && (
                      <p className="mt-2 text-[11px] text-rose-600">
                        {postalCodeError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
              <div
                className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide"
                style={fontJakarta}
              >
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
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
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
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200 flex items-center gap-2.5 text-[11.5px] text-sky-800 font-medium">
                  <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    Use this password along with your Email address to sign in
                    to the Student Portal anytime.
                  </span>
                </div>
              </div>
            </div>

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

        {/* STEP 2 */}
        {currentStep === 2 && (
          <form onSubmit={handleNext} className="space-y-6 max-w-4xl mx-auto w-full">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
              <div
                className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide"
                style={fontJakarta}
              >
                <BookOpen className="w-4 h-4 text-[#C10F3A]" />
                <span>Enrollment Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Course Selection
                  </label>
                  <div className="relative">
                    <select
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs font-bold text-stone-800 focus:outline-none appearance-none cursor-pointer shadow-2xs"
                    >
                      {dbCourses.length > 0 ? (
                        dbCourses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title} — ({c.level || "Beginner"})
                          </option>
                        ))
                      ) : (
                        <option value="">Kathak Beginners Course</option>
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

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
                          Group Fee: ₹
                          {selectedCourseObj.groupFeeINR ||
                            selectedCourseObj.feeINR ||
                            "2,200"}
                          /mo (USD ${selectedCourseObj.groupFeeUSD || 50}) •{" "}
                          {selectedCourseObj.duration || "10 Classes/month"}
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

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Batch Assignment
                  </label>
                  <div className="relative">
                    <select
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none appearance-none cursor-pointer shadow-2xs"
                    >
                      {availableBatches.length > 0 ? (
                        availableBatches.map((batchOption) => (
                          <option key={batchOption.id} value={batchOption.id}>
                            {batchOption.name}
                            {batchOption.schedule ? ` • ${batchOption.schedule.split('|').slice(0,2).join(' ')}` : ""}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No active or upcoming batches available
                        </option>
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
              <div
                className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide"
                style={fontJakarta}
              >
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
                      Guardian Name {(isUnder18 || (getAgeFromDob(dob) ?? 99) < 18) ? <span className="text-[#C10F3A]">*</span> : null}
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
                      Emergency Contact {(isUnder18 || (getAgeFromDob(dob) ?? 99) < 18) ? <span className="text-[#C10F3A]">*</span> : null}
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

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-white/40 space-y-6 relative">
              <div
                className="inline-flex items-center gap-2 bg-[#FDF2F4] text-[#C10F3A] px-3.5 py-1.5 rounded-full text-lg font-semibold tracking-wide"
                style={fontJakarta}
              >
                <CreditCard className="w-4 h-4 text-[#C10F3A]" />
                <span>Payment Setup</span>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <h4 className="font-bold text-sm text-stone-900">
                  Enrollment Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 block text-[11px]">
                      Selected Course
                    </span>
                    <span className="font-bold text-[#C10F3A]">{selectedCourseObj?.title || "Selected Course"}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">
                      Assigned Batch
                    </span>
                    <span className="font-bold text-stone-800">
                    {selectedBatch?.name || "Not assigned"}
                  </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">
                      Monthly Fee
                    </span>
                    <span className="font-bold text-stone-900">
                      ₹{selectedCourseObj?.groupFeeINR || "2,200"} / month
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-stone-700">
                  Select Payment Method
                </label>
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
                        <span className="font-bold text-xs text-stone-800 block">
                          GPay / PhonePe / Paytm
                        </span>
                        <span className="text-[10.5px] text-stone-500">
                          Instant UPI Auto-Pay
                        </span>
                      </div>
                    </div>
                    {paymentMethod === "upi" && (
                      <CheckCircle2 className="w-5 h-5 text-[#C10F3A]" />
                    )}
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
                        <span className="font-bold text-xs text-stone-800 block">
                          Credit / Debit Card
                        </span>
                        <span className="text-[10.5px] text-stone-500">
                          Visa, Mastercard, RuPay
                        </span>
                      </div>
                    </div>
                    {paymentMethod === "card" && (
                      <CheckCircle2 className="w-5 h-5 text-[#C10F3A]" />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800 font-semibold">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>256-Bit SSL Encrypted Secure Payment Gateway</span>
              </div>

              {submitError ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold">
                  {submitError}
                </div>
              ) : null}
            </div>

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
                <span>
                  {isSubmitted
                    ? "Processing Registration..."
                    : "Complete Registration & Pay"}
                </span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showVideoModal && selectedCourseObj?.videoUrl && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            ref={videoModalContainerRef}
            className="relative w-full max-w-4xl bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-700 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#C10F3A] text-white flex items-center justify-center font-bold">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {selectedCourseObj.title}
                  </h3>
                  <span className="text-[11px] text-stone-400 font-medium">
                    Promotional Demo Video
                  </span>
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

            <div
              onContextMenu={(e) => e.preventDefault()}
              className="relative w-full aspect-video bg-black overflow-hidden select-none"
            >
              <div className="absolute top-4 right-4 z-50 pointer-events-none select-none drop-shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Kathak Logo"
                  className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] opacity-90"
                />
              </div>

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

      <footer className="relative z-10 text-center py-4 text-stone-500 text-xs">
        © {new Date().getFullYear()} Kathak by Harshita. All rights reserved.
      </footer>
    </div>
  );
}