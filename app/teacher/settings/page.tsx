'use client';
import React, { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);

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

              <div className="pt-4 mt-4 border-t border-gray-100">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold text-[#EF4444] hover:bg-[#FEF2F2] transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Log Out
                </button>
              </div>
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

                {/* Avatar Upload */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                  <div className="relative">
                    <img src="https://i.pravatar.cc/150?img=47" alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-50" />
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-[#A42E30] hover:border-[#A42E30] shadow-sm transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                  </div>
                  <div>
                    <div className="flex gap-3">
                      <button className="bg-[#A42E30] hover:bg-[#8B2627] text-white text-[13px] font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
                        Change Photo
                      </button>
                      <button className="bg-white border border-gray-200 hover:bg-gray-50 text-[#464555] text-[13px] font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
                        Remove
                      </button>
                    </div>
                    <p className="text-[12px] text-gray-500 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                      <input type="text" defaultValue="Priya" className="w-full bg-white border border-gray-200 text-[#0B1C30] text-[14px] font-medium py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                      <input type="text" defaultValue="Iyer" className="w-full bg-white border border-gray-200 text-[#0B1C30] text-[14px] font-medium py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                      <div className="relative">
                        <input type="email" defaultValue="priya.iyer@institution.edu" className="w-full bg-gray-50 border border-gray-200 text-gray-500 text-[14px] font-medium py-3 pl-10 pr-4 rounded-xl outline-none cursor-not-allowed" readOnly />
                        <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                      <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-white border border-gray-200 text-[#0B1C30] text-[14px] font-medium py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Department / Bio</label>
                    <textarea rows={3} defaultValue="Senior Instructor - Bharatnatyam Intermediate level. Focused on classical expressions and foundational footwork." className="w-full bg-white border border-gray-200 text-[#0B1C30] text-[14px] py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all resize-none"></textarea>
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
                    <button onClick={() => setEmailNotifs(!emailNotifs)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifs ? 'bg-[#A42E30]' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Option 2 */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div>
                      <div className="text-[15px] font-bold text-[#0B1C30]">Push Notifications</div>
                      <div className="text-[13px] text-gray-500 mt-1">Get real-time alerts for student submissions and leave approvals.</div>
                    </div>
                    <button onClick={() => setPushNotifs(!pushNotifs)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushNotifs ? 'bg-[#A42E30]' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Option 3 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[15px] font-bold text-[#0B1C30]">SMS Alerts</div>
                      <div className="text-[13px] text-gray-500 mt-1">Only receive messages for urgent system announcements.</div>
                    </div>
                    <button onClick={() => setSmsNotifs(!smsNotifs)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${smsNotifs ? 'bg-[#A42E30]' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${smsNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
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
                    <input type="password" placeholder="••••••••" className="w-full max-w-md bg-white border border-gray-200 text-[#0B1C30] text-[14px] font-medium py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                      <input type="password" placeholder="Enter new password" className="w-full bg-white border border-gray-200 text-[#0B1C30] text-[14px] font-medium py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                      <input type="password" placeholder="Confirm new password" className="w-full bg-white border border-gray-200 text-[#0B1C30] text-[14px] font-medium py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" />
                    </div>
                  </div>

                  <div className="pt-6 mt-8 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-[15px] font-bold text-[#0B1C30]">Two-Factor Authentication (2FA)</div>
                      <div className="text-[13px] text-gray-500 mt-1">Add an extra layer of security to your account.</div>
                    </div>
                    <button className="bg-white border border-gray-200 hover:bg-gray-50 text-[#0B1C30] text-[13px] font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Global Save Action */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
              <button className="text-[14px] font-semibold text-[#464555] hover:text-[#0B1C30] transition-colors">
                Cancel
              </button>
              <button className="bg-[#A42E30] hover:bg-[#8B2627] text-white text-[14px] font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-[#A42E30]/20">
                Save Changes
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}