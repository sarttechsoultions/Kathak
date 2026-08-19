import { useState } from "react";
import { SidebarPermission } from "@/lib/permissions";
import { DbBatchItem, BankDetail, DocumentItem } from "./types";

export function useTeacherFormState() {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Select Gender");
  const [primaryExpertise, setPrimaryExpertise] = useState<"Kathak" | "Bharatanatyam" | "Contemporary" | "Odissi">("Kathak");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [designation, setDesignation] = useState("Senior Instructor");
  const [assignedBatches, setAssignedBatches] = useState<string[]>(["Beginners Morning Zen"]);
  const [availableDbBatches, setAvailableDbBatches] = useState<DbBatchItem[]>([]);
  const [salaryRate, setSalaryRate] = useState("₹ 0.00");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accessLevel, setAccessLevel] = useState<"FACULTY" | "ADMIN">("FACULTY");
  const [selectedPermissions, setSelectedPermissions] = useState<SidebarPermission[]>([
    "VIEW_DASHBOARD",
    "MANAGE_CLASSES",
  ]);
  const [avatarUrl, setAvatarUrl] = useState<string>("/Ananya.png");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Personal Info Extras
  const [maritalStatus, setMaritalStatus] = useState("Select Status");
  const [nationality, setNationality] = useState("Indian");
  const [languagesKnown, setLanguagesKnown] = useState("");

  // Emergency & Bank Details
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>([]);
  const [emergencyContactInput, setEmergencyContactInput] = useState("");
  
  // Structured Bank Accounts
  const [bankAccounts, setBankAccounts] = useState<BankDetail[]>([]);
  const [bankAccountInput, setBankAccountInput] = useState<BankDetail>({
    bankName: "",
    accountNumber: "",
    ifsc: "",
    accountHolderName: "",
  });

  const addEmergencyContact = () => {
    const val = emergencyContactInput.trim();
    if (!val) return;
    if (!/^[0-9+\-\s]{6,15}$/.test(val)) {
      alert("Please enter a valid phone number (digits only, 6-15 characters).");
      return;
    }
    setEmergencyContacts((prev) => [...prev, val]);
    setEmergencyContactInput("");
  };

  const addBankAccount = () => {
    if (!bankAccountInput.bankName || !bankAccountInput.accountNumber || !bankAccountInput.ifsc) {
      alert("Bank Name, Account Number, and IFSC are required.");
      return;
    }
    setBankAccounts((prev) => [...prev, { ...bankAccountInput }]);
    setBankAccountInput({ bankName: "", accountNumber: "", ifsc: "", accountHolderName: "" });
  };

  // Multiple Documents
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const token = localStorage.getItem("kathak_admin_token") || localStorage.getItem("kathak_token");
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${apiBase}/upload/image`, {
        method: "POST",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (data.status !== "success") {
        throw new Error(data.message || "Failed to upload file");
      }
      return data.data?.url || data.data?.secure_url || data.data?.directUrl || "";
    } catch (err: any) {
      throw err;
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please select an image file under 5MB.");
        return;
      }
      // Show local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      setIsUploadingAvatar(true);
      try {
        const uploadedUrl = await uploadToCloudinary(file);
        setAvatarUrl(uploadedUrl);
        setAvatarFile(null); // Clear the file since it's already uploaded
      } catch (err: any) {
        alert("Error uploading avatar: " + err.message);
        setAvatarUrl("/Ananya.png"); // Revert
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, selectId: string) => {
    const file = e.target.files?.[0];
    const selectEl = document.getElementById(selectId) as HTMLSelectElement;
    const typeVal = selectEl?.options[selectEl.selectedIndex]?.text || "Document";
    
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Please select a file under 10MB.");
        return;
      }
      
      const newDocIndex = documents.length;
      const newDoc = {
        title: file.name,
        type: typeVal,
        url: "",
        isUploading: true
      };
      
      setDocuments(prev => [...prev, newDoc]);
      e.target.value = '';

      try {
        const uploadedUrl = await uploadToCloudinary(file);
        setDocuments(prev => {
          const updated = [...prev];
          if (updated[newDocIndex]) {
            updated[newDocIndex].url = uploadedUrl;
            updated[newDocIndex].isUploading = false;
          }
          return updated;
        });
      } catch (err: any) {
        alert("Error uploading document: " + err.message);
        setDocuments(prev => prev.filter((_, i) => i !== newDocIndex)); // Remove failed doc
      }
    }
  };

  const handleIdProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload a document under 5MB.");
      return;
    }
    setIdProofFile(file);
  };

  return {
    fullName, setFullName,
    dob, setDob,
    gender, setGender,
    primaryExpertise, setPrimaryExpertise,
    email, setEmail,
    countryCode, setCountryCode,
    phoneNumber, setPhoneNumber,
    address, setAddress,
    joiningDate, setJoiningDate,
    designation, setDesignation,
    assignedBatches, setAssignedBatches,
    availableDbBatches, setAvailableDbBatches,
    salaryRate, setSalaryRate,
    password, setPassword,
    showPassword, setShowPassword,
    accessLevel, setAccessLevel,
    selectedPermissions, setSelectedPermissions,
    avatarUrl, setAvatarUrl,
    isSubmitting, setIsSubmitting,
    maritalStatus, setMaritalStatus,
    nationality, setNationality,
    languagesKnown, setLanguagesKnown,
    emergencyContacts, setEmergencyContacts,
    emergencyContactInput, setEmergencyContactInput,
    addEmergencyContact,
    bankAccounts, setBankAccounts,
    bankAccountInput, setBankAccountInput,
    addBankAccount,
    documents, setDocuments,
    handlePhotoUpload,
    handleDocumentUpload,
    isUploadingAvatar,
    avatarFile, setAvatarFile,
  };
}
