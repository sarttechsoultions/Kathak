'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest, ENDPOINTS } from '@/lib/api';
import { openThemeSuccess, openThemeError } from '@/components/ThemeDialogProvider';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    designation: '',
    avatarUrl: ''
  });

  // Security State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification State
  const [notifs, setNotifs] = useState({
    emailNotifs: true,
    pushNotifs: true,
    smsNotifs: false
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiRequest<{ status: string; data: any }>(ENDPOINTS.TEACHER_SETTINGS);
        if (res.status === "success" && res.data) {
          setProfile({
            fullName: res.data.fullName || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            designation: res.data.designation || res.data.primaryExpertise || "",
            avatarUrl: res.data.avatarUrl || ""
          });
          
          if (res.data.notificationPrefs) {
            setNotifs({
              emailNotifs: res.data.notificationPrefs.emailNotifs ?? true,
              pushNotifs: res.data.notificationPrefs.pushNotifs ?? true,
              smsNotifs: res.data.notificationPrefs.smsNotifs ?? false
            });
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const payload = {
        fullName: profile.fullName,
        phone: profile.phone,
        designation: profile.designation,
        avatarUrl: profile.avatarUrl
      };
      await apiRequest(`${ENDPOINTS.TEACHER_SETTINGS}/profile`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      openThemeSuccess("Profile Updated", "Your personal information has been saved.");
    } catch (error: any) {
      openThemeError(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      openThemeError("Passwords do not match");
      return;
    }
    if (!passwords.currentPassword) {
      openThemeError("Please enter your current password");
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest(`${ENDPOINTS.TEACHER_SETTINGS}/security`, {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });
      openThemeSuccess("Password Updated", "Your password has been changed securely.");
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      openThemeError(error.message || "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifs = async () => {
    setIsSaving(true);
    try {
      await apiRequest(`${ENDPOINTS.TEACHER_SETTINGS}/notifications`, {
        method: "PUT",
        body: JSON.stringify(notifs)
      });
      openThemeSuccess("Preferences Saved", "Your notification settings have been updated.");
    } catch (error: any) {
      openThemeError(error.message || "Failed to save notifications");
    } finally {
      setIsSaving(false);
    }
  };

  const saveCurrentTab = () => {
    if (activeTab === 'profile') handleSaveProfile();
    else if (activeTab === 'security') handleSaveSecurity();
    else if (activeTab === 'notifications') handleSaveNotifs();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#A42E30]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 text-[#0B1C30]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap');
        `
      }} />

      <main className="max-w-[1100px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-[32px] font-bold text-[#0B1C30] tracking-tight mb-2 leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Account Settings
          </h1>
          <p className="text-[15px] text-[#464555]">
            Manage your profile, preferences, and security settings.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-[260px] flex-shrink-0 bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-4 sticky top-8">
            <nav className="space-y-1.5">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all ${
                  activeTab === 'profile' 
                  ? 'bg-[#FFF1F1] text-[#A42E30]' 
                  : 'text-[#464555] hover:bg-gray-50 hover:text-[#0B1C30]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                My Profile
              </button>

              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all ${
                  activeTab === 'notifications' 
                  ? 'bg-[#FFF1F1] text-[#A42E30]' 
                  : 'text-[#464555] hover:bg-gray-50 hover:text-[#0B1C30]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                Notifications
              </button>

              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all ${
                  activeTab === 'security' 
                  ? 'bg-[#FFF1F1] text-[#A42E30]' 
                  : 'text-[#464555] hover:bg-gray-50 hover:text-[#0B1C30]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Security & Password
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-8">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-[20px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Personal Information</h2>
                  <p className="text-[14px] text-gray-500 mt-1">Update your photo and personal details here.</p>
                </div>

                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                  <div className="relative">
                    <img src={profile.avatarUrl || "https://i.pravatar.cc/150?img=47"} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-50" />
                  </div>
                  <div>
                    <div className="flex gap-3">
                      <button className="bg-[#A42E30] hover:bg-[#8B2627] text-white text-[13px] font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
                        Change Photo
                      </button>
                    </div>
                    <p className="text-[12px] text-gray-500 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" name="fullName" value={profile.fullName} onChange={handleProfileChange} className="w-full bg-white border border-gray-200 text-[#0B1C30] text-[14px] font-medium py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                      <div className="relative">
                        <input type="email" value={profile.email} className="w-full bg-gray-50 border border-gray-200 text-gray-500 text-[14px] font-medium py-3 pl-10 pr-4 rounded-xl outline-none cursor-not-allowed" readOnly />
                        <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                      <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} className="w-full bg-white border border-gray-200 text-[#0B1C30] text-[14px] font-medium py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Department / Bio</label>
                    <textarea name="designation" value={profile.designation} onChange={handleProfileChange} rows={3} className="w-full bg-white border border-gray-200 text-[#0B1C30] text-[14px] py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all resize-none"></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-[20px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notification Preferences</h2>
                  <p className="text-[14px] text-gray-500 mt-1">Manage how you receive alerts and updates.</p>
                </div>

                <div className="space-y-6">
                  {/* Option 1 */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div>
                      <div className="text-[15px] font-bold text-[#0B1C30]">Email Notifications</div>
                      <div className="text-[13px] text-gray-500 mt-1">Receive daily summaries and important alerts directly to your inbox.</div>
                    </div>
                    <button onClick={() => setNotifs({...notifs, emailNotifs: !notifs.emailNotifs})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifs.emailNotifs ? 'bg-[#A42E30]' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifs.emailNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Option 2 */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div>
                      <div className="text-[15px] font-bold text-[#0B1C30]">Push Notifications</div>
                      <div className="text-[13px] text-gray-500 mt-1">Get real-time alerts for student submissions and leave approvals.</div>
                    </div>
                    <button onClick={() => setNotifs({...notifs, pushNotifs: !notifs.pushNotifs})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifs.pushNotifs ? 'bg-[#A42E30]' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifs.pushNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Option 3 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[15px] font-bold text-[#0B1C30]">SMS Alerts</div>
                      <div className="text-[13px] text-gray-500 mt-1">Only receive messages for urgent system announcements.</div>
                    </div>
                    <button onClick={() => setNotifs({...notifs, smsNotifs: !notifs.smsNotifs})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifs.smsNotifs ? 'bg-[#A42E30]' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifs.smsNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-[20px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Security Settings</h2>
                  <p className="text-[14px] text-gray-500 mt-1">Update your password and secure your account.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                    <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" className="w-full max-w-md bg-white border border-gray-200 text-[#0B1C30] text-[14px] font-medium py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                      <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} placeholder="Enter new password" className="w-full bg-white border border-gray-200 text-[#0B1C30] text-[14px] font-medium py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                      <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} placeholder="Confirm new password" className="w-full bg-white border border-gray-200 text-[#0B1C30] text-[14px] font-medium py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Global Save Action */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
              <button className="text-[14px] font-semibold text-[#464555] hover:text-[#0B1C30] transition-colors">
                Cancel
              </button>
              <button 
                onClick={saveCurrentTab}
                disabled={isSaving}
                className="bg-[#A42E30] hover:bg-[#8B2627] text-white text-[14px] font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-[#A42E30]/20 disabled:opacity-70 flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}