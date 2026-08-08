'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, Calendar, Clock, Settings, Edit3, Trash2, Image as ImageIcon, Video, Plus, CheckCircle2 } from 'lucide-react';

export default function CreateNewExam() {
  const [examTitle, setExamTitle] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [examDate, setExamDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('120');
  
  const [autoGrading, setAutoGrading] = useState(true);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [passingScore, setPassingScore] = useState(40);

  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState('5');
  const [questionType, setQuestionType] = useState('multiple_choice');
  
  const [options, setOptions] = useState([
    { id: 1, text: '', isCorrect: false },
    { id: 2, text: '', isCorrect: true },
    { id: 3, text: '', isCorrect: false }
  ]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B1C30] p-8 pb-24" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-[1200px] mx-auto">
        
        {/* Top Navigation */}
        <div className="mb-6">
          {/* Assuming you want to link back to the command center */}
          <Link href="/teacher/exam" className="inline-flex items-center text-[#0B1C30] hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Top Section: Basic Info & Scheduling */}
        <div className="flex gap-8 mb-10">
          
          {/* Basic Information */}
          <div className="flex-1 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Info className="w-5 h-5 text-[#A42E30]" />
              <h2 className="text-[20px] font-bold text-[#0B1C30]">Basic Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Exam Title</label>
                <input 
                  type="text" 
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Mid-term Assessment: Advanced Quantum Mechanics"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all text-sm placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Batch Selection</label>
                  <div className="relative">
                    <select 
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl appearance-none outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all text-sm text-gray-600"
                    >
                      <option value="" disabled>Select Batch</option>
                      <option value="batch1">Batch 2024-A</option>
                      <option value="batch2">Batch 2024-B</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Course Mapping</label>
                  <div className="relative">
                    <select 
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl appearance-none outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all text-sm text-gray-600"
                    >
                      <option value="" disabled>Select Course</option>
                      <option value="course1">Physics 101</option>
                      <option value="course2">Chemistry 202</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="w-[320px] bg-[#9F3031] p-8 rounded-2xl text-white relative overflow-hidden shadow-lg">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="flex items-center gap-2 mb-8 relative z-10">
              <Clock className="w-5 h-5 text-white/80" />
              <h2 className="text-[20px] font-bold text-white">Scheduling</h2>
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-2 uppercase tracking-wide">Exam Date</label>
                <input 
                  type="date" 
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none text-sm text-white placeholder-white/50 focus:bg-white/20 transition-all [&::-webkit-calendar-picker-indicator]:invert"
                  placeholder="mm/dd/yyyy"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-white/70 mb-2 uppercase tracking-wide">Start Time</label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none text-sm text-white placeholder-white/50 focus:bg-white/20 transition-all [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-2 uppercase tracking-wide">Duration (Minutes)</label>
                <input 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none text-sm text-white focus:bg-white/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Exam Settings */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-[#A42E30]" />
            <h2 className="text-[20px] font-bold text-[#0B1C30]">Exam Settings</h2>
          </div>

          <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            
            {/* Auto Grading Toggle */}
            <div className="flex items-start gap-4">
              <button 
                onClick={() => setAutoGrading(!autoGrading)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full mt-1 transition-colors ${autoGrading ? 'bg-[#A42E30]' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoGrading ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <div>
                <div className="font-bold text-[#0B1C30]">Auto-grading</div>
                <div className="text-xs text-gray-500 mt-1">Enable instant feedback for<br/>objective questions.</div>
              </div>
            </div>

            {/* Randomize Questions Toggle */}
            <div className="flex items-start gap-4">
              <button 
                onClick={() => setRandomizeQuestions(!randomizeQuestions)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full mt-1 transition-colors ${randomizeQuestions ? 'bg-[#A42E30]' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${randomizeQuestions ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <div>
                <div className="font-bold text-[#0B1C30]">Randomize Questions</div>
                <div className="text-xs text-gray-500 mt-1">Shuffle question order for each<br/>individual student.</div>
              </div>
            </div>

            {/* Passing Score Slider */}
            <div className="w-[300px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#0B1C30]">Passing Score (%)</span>
                <span className="text-sm font-bold text-[#A42E30]">{passingScore}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={passingScore} 
                onChange={(e) => setPassingScore(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#A42E30]"
              />
            </div>

          </div>
        </div>

        {/* Question Builder */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#A42E30]" />
              <h2 className="text-[20px] font-bold text-[#0B1C30]">Question Builder</h2>
            </div>
            <div className="bg-[#FFF1F1] text-[#A42E30] px-4 py-1.5 rounded-full text-sm font-bold">
              Total Marks: 0
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
            
            {/* Question Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-[#A42E30] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">ACTIVE QUESTION</div>
                
                {/* Dots indicator (mockup) */}
                <div className="flex gap-1.5 ml-4">
                   <div className="w-8 h-2 rounded-full bg-[#E5E7EB]"></div>
                   <div className="w-8 h-2 rounded-full bg-[#E5E7EB]"></div>
                   <div className="w-8 h-2 rounded-full bg-[#E5E7EB]"></div>
                   <div className="w-8 h-2 rounded-full bg-[#E5E7EB]"></div>
                   <div className="w-8 h-2 rounded-full bg-[#E5E7EB]"></div>
                   <div className="w-8 h-2 rounded-full bg-[#E5E7EB]"></div>
                </div>
              </div>
              
              <button className="text-gray-400 hover:text-[#A42E30] transition-colors p-2">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-8">
              {/* Left Column: Question Content */}
              <div className="flex-1 space-y-6">
                
                {/* Question Text */}
                <div>
                  <label className="block text-xs font-bold text-[#0B1C30] mb-2">Question Text</label>
                  <textarea 
                    rows={4}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter the question prompt here..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all text-sm resize-none"
                  ></textarea>
                </div>

                {/* Media Attachments */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <label className="block text-xs font-bold text-[#0B1C30]">Media Attachment</label>
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 border-dashed rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                      <ImageIcon className="w-4 h-4" />
                      Upload Image
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 border-dashed rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                      <Video className="w-4 h-4" />
                      Upload Video
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg py-3 text-center text-xs font-medium text-gray-500">
                    No media attached. Supports JPG, PNG, MP4 up to 50MB
                  </div>
                </div>

                {/* Answer Choices */}
                <div>
                  <label className="block text-xs font-bold text-[#0B1C30] mb-3">Answer Choices</label>
                  <div className="space-y-3">
                    
                    {/* Option 1 */}
                    <div className="flex items-center gap-4 group">
                      <button className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0 group-hover:border-[#A42E30] transition-colors"></button>
                      <input 
                        type="text" 
                        placeholder="Option 1"
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-transparent rounded-lg outline-none focus:border-gray-300 focus:bg-white transition-all text-sm"
                      />
                    </div>

                    {/* Option 2 (Correct) */}
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border-[6px] border-[#A42E30] bg-white flex-shrink-0 shadow-[0_0_0_1px_rgba(164,46,48,0.2)]"></div>
                      <input 
                        type="text" 
                        placeholder="Option 2 (Correct Answer)"
                        defaultValue="Option 2 (Correct Answer)"
                        className="flex-1 px-4 py-2.5 bg-[#FFF8F8] border border-[#FCA5A5] rounded-lg outline-none text-sm text-[#A42E30]"
                      />
                    </div>

                    {/* Option 3 */}
                    <div className="flex items-center gap-4 group">
                      <button className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0 group-hover:border-[#A42E30] transition-colors"></button>
                      <input 
                        type="text" 
                        placeholder="Option 3"
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-transparent rounded-lg outline-none focus:border-gray-300 focus:bg-white transition-all text-sm"
                      />
                    </div>

                    <button className="flex items-center gap-1.5 text-[#A42E30] text-xs font-bold mt-4 hover:underline">
                      <Plus className="w-3.5 h-3.5" />
                      Add Option
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Question Settings */}
              <div className="w-[200px] space-y-6">
                
                {/* Question Type */}
                <div>
                  <label className="block text-xs font-bold text-[#0B1C30] mb-3">Question Type</label>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setQuestionType('multiple_choice')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                        questionType === 'multiple_choice' 
                        ? 'bg-[#A42E30] border-[#A42E30] text-white' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 ${questionType === 'multiple_choice' ? 'border-white bg-white/20' : 'border-gray-400'}`}>
                        {questionType === 'multiple_choice' && <div className="w-full h-full rounded-full bg-white border-[2px] border-[#A42E30]"></div>}
                      </div>
                      Multiple Choice
                    </button>
                    
                    <button 
                      onClick={() => setQuestionType('long_text')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                        questionType === 'long_text' 
                        ? 'bg-[#A42E30] border-[#A42E30] text-white' 
                        : 'bg-[#F8F9FB] border-transparent text-[#0B1C30] hover:bg-gray-100'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Long Text
                    </button>
                  </div>
                </div>

                {/* Marks per Question */}
                <div>
                  <label className="block text-xs font-bold text-[#0B1C30] mb-2">Marks per Question</label>
                  <input 
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-24 px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#A42E30] transition-all text-sm"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Add New Question Button */}
          <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#A42E30] hover:border-[#A42E30] hover:bg-[#FFF1F1] transition-all group">
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm">Add New Question</span>
          </button>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-8 z-50 flex justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-[#0B1C30] hover:bg-gray-50 transition-colors">
          Save as Draft
        </button>
        <button className="px-6 py-2.5 bg-[#A42E30] rounded-xl text-sm font-bold text-white hover:bg-[#8B2627] shadow-md shadow-[#A42E30]/20 transition-all transform hover:-translate-y-0.5">
          Publish Exam
        </button>
      </div>
    </div>
  );
}