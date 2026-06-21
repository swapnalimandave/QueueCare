import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, Radio, Brain, CalendarCheck2, MessageSquareCode, 
  MapPin, Clock, Users, Calendar, CheckCircle2, Shield, Star, Sparkles, Smile, BookOpen, Stethoscope
} from 'lucide-react';
import { APP_FEATURES, TESTIMONIALS } from '../mockData';
import { useTheme } from '../ThemeContext';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  isLoggedIn: boolean;
  onQuickBook: () => void;
  onMockJoinQueue: () => void;
}

export default function LandingPage({
  onNavigate,
  isLoggedIn,
  onQuickBook,
  onMockJoinQueue
}: LandingPageProps) {
  const { colors, isDark } = useTheme();

  // Function to render correct Lucide icon based on feature mock data string
  const renderFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio':
        return <Radio className="h-5 w-5 text-[#4A5FE8]" />;
      case 'BrainCircuit':
        return <Brain className="h-5 w-5 text-[#4A5FE8]" />;
      case 'CalendarCheck2':
        return <CalendarCheck2 className="h-5 w-5 text-[#4A5FE8]" />;
      case 'MessageSquareText':
        return <MessageSquareCode className="h-5 w-5 text-[#4A5FE8]" />;
      case 'CalendarDays':
        return <Calendar className="h-5 w-5 text-[#4A5FE8]" />;
      case 'UserRoundCheck':
        return <Users className="h-5 w-5 text-[#4A5FE8]" />;
      default:
        return <Shield className="h-5 w-5 text-[#4A5FE8]" />;
    }
  };

  const handleDoctorsPitchScroll = () => {
    const el = document.getElementById('doctors-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative min-h-screen overflow-x-hidden ${colors.bgMain}`}>
      
      {/* Decorative Blur Blobs in Background */}
      <div className="absolute top-20 left-[-10vw] w-[50vw] h-[50vw] bg-[#4A5FE8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40vh] right-[-10vw] w-[40vw] h-[40vw] bg-[#8B9FF9]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20vh] left-[5vw] w-[35vw] h-[35vw] bg-pink-300/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text and CTA Pillar */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-100/80 dark:bg-slate-800 text-[#4A5FE8] dark:text-blue-400 text-xs font-bold tracking-wide"
            >
              <Sparkles className="h-3.5 w-3.5 animate-spin text-amber-500" />
              <span>Smart Hospital Management & Live Tracking</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-[#1A1A2E]"
            >
              Skip the Wait.<br />
              <span className="bg-gradient-to-r from-[#4A5FE8] to-indigo-600 bg-clip-text text-transparent">
                Book Smarter.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-[#1A1A2E]/75 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              No more crowded waiting rooms or endless clinical delays. Experience real-time queue tracking, precise machine-predicted wait metrics, and automated alerts for seamless doctor appointments.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => onNavigate('/patient/book')}
                className="w-full sm:w-auto px-8 py-4 bg-[#4A5FE8] hover:bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 cursor-pointer group"
                id="hero-book-cta"
              >
                <span>Book an Appointment</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={handleDoctorsPitchScroll}
                className="w-full sm:w-auto px-8 py-4 bg-white/90 hover:bg-white text-[#1A1A2E] rounded-full font-semibold shadow-sm hover:-translate-y-0.5 transition-all text-center cursor-pointer border border-[#1A1A2E]/10"
                id="hero-doctors-cta"
              >
                For Hospitals/Doctors →
              </button>
            </motion.div>

            {/* Quick Demo Assist */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-4 flex flex-wrap justify-center lg:justify-start items-center gap-3 text-semibold text-xs text-indigo-700/80"
            >
              <span className="font-bold">✨ Quick Access:</span>
              <button 
                onClick={() => onNavigate('/patient/dashboard')} 
                className="underline hover:text-blue-700 font-semibold"
              >
                View Patient Panel
              </button>
              <span className="text-[#1A1A2E]/20">|</span>
              <button 
                onClick={() => onNavigate('/doctor/dashboard')} 
                className="underline hover:text-indigo-800 font-semibold"
              >
                View Doctor Panel
              </button>
            </motion.div>
          </div>

          {/* Right Floating Live Mockup Widget and Bubble Decorators */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Bubble decoration 1 */}
            <div className="absolute top-[-30px] right-4 bg-white/40 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/60 animate-bounce transition-transform" style={{ animationDuration: '6s' }}>
              <Stethoscope className="h-6 w-6 text-emerald-500" />
            </div>

            {/* Bubble decoration 2 */}
            <div className="absolute bottom-1/4 left-[-40px] bg-white/40 backdrop-blur-md p-3.5 rounded-full shadow-lg border border-white/60 animate-bounce" style={{ animationDuration: '4.5s' }}>
              <Clock className="h-6 w-6 text-amber-500" />
            </div>



            {/* Hero Mockup Live widget Card */}
            <motion.div 
              style={{ rotateY: 10, rotateX: 5 }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-[360px] bg-white rounded-[24px] p-6 shadow-2xl shadow-indigo-300/40 relative border border-white/50"
              id="hero-floating-mockup"
            >
              <div className="flex justify-between items-center pb-4 border-b border-indigo-50">
                <div className="flex items-center space-x-2.5">
                  <span className="h-3.5 w-3.5 rounded-full bg-[#4A5FE8] animate-ping absolute" />
                  <span className="h-3.5 w-3.5 rounded-full bg-[#4A5FE8] relative" />
                  <div>
                    <h4 className="font-extrabold text-sm text-[#1A1A2E]">Live Queue Status</h4>
                    <p className="text-[10px] text-slate-450 font-semibold uppercase">Dr. Robert Chen</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full">
                  Primary care
                </span>
              </div>

              {/* Progress Ring & Wait Counter */}
              <div className="my-6 flex flex-col items-center justify-center relative">
                
                {/* SVG Wait Progress */}
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      fill="transparent" 
                      stroke="#F0F3FD" 
                      strokeWidth="8"
                    />
                    {/* Progress Circle Arc */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      fill="transparent" 
                      stroke="#4A5FE8" 
                      strokeWidth="8"
                      strokeDasharray="264"
                      strokeDashoffset="80" 
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Internal Statistics */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Est. Wait</span>
                    <span className="text-3xl font-black text-[#1A1A2E]">12 min</span>
                    <span className="text-[10px] text-[#4A5FE8] font-bold">Position #3</span>
                  </div>
                </div>
              </div>

              {/* Detailed Card Rows */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center bg-indigo-50/50 p-2.5 rounded-xl text-xs">
                  <span className="text-slate-500 font-semibold">Your Appointment:</span>
                  <span className="font-extrabold text-[#1A1A2E]">10:30 AM (Confirmed)</span>
                </div>
                
                <div className="flex justify-between items-center px-1 text-xs">
                  <span className="text-slate-450 font-medium">Currently treating:</span>
                  <span className="text-slate-700 font-bold">John Doe (#2)</span>
                </div>

                <button 
                  onClick={() => onNavigate('/patient/dashboard')}
                  className="w-full mt-2 py-2.5 bg-[#1A1A2E] text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all text-center flex items-center justify-center space-x-1.5"
                >
                  <span>Preview Live Gauge</span>
                  <span className="text-[9px] bg-red-500 text-white font-bold px-1 rounded animate-pulse">HOT</span>
                </button>
              </div>

              {/* Patient Badge Card on Top Right */}
              <div className="absolute -top-6 -left-8 bg-white py-2.5 px-4 rounded-xl shadow-lg border border-slate-50 flex items-center space-x-2">
                <div className="p-1 px-2.5 bg-indigo-50 text-[#4A5FE8] font-bold text-sm rounded-lg">
                  #3
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Current Queue Pos</p>
                  <p className="text-xs font-bold text-slate-800">You are next up!</p>
                </div>
              </div>
              
            </motion.div>
          </div>

        </div>
      </section>

      {/* Trust & Stats Bar */}
      <section className="bg-white/80 border-y border-[#4A5FE8]/10 py-8 relative shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] tracking-tight">500+</p>
              <p className="text-xs md:text-sm font-semibold text-slate-500 tracking-wide">Affiliated Hospitals</p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-[#4A5FE8] tracking-tight">10,005+</p>
              <p className="text-xs md:text-sm font-semibold text-slate-500 tracking-wide">Relieved Patients Today</p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] tracking-tight">98.2%</p>
              <p className="text-xs md:text-sm font-semibold text-slate-500 tracking-wide">Wait-Time Prediction Accuracy</p>
            </div>

            <div className="space-y-1 col-span-2 lg:col-span-1">
              <p className="text-3xl md:text-4xl font-bold text-emerald-600 tracking-tight">&lt; 8 min</p>
              <p className="text-xs md:text-sm font-semibold text-slate-500 tracking-wide">Average Clinician Overhead</p>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="features">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[#4A5FE8] text-xs uppercase tracking-widest font-black">UNPARALLELED UTILITY</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1A1A2E]">
            Unveiling hospital efficiency dashboards
          </h2>
          <p className="text-[#1A1A2E]/70 font-normal">
            QueueCare coordinates clinical schedules and patient priorities using robust automated workflows suited for general triage, diagnostics, and subspecialty calendars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {APP_FEATURES.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-white/90 hover:bg-white p-6 rounded-[20px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-indigo-50 flex flex-col space-y-4"
              id={`feature-card-${idx}`}
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-full shrink-0">
                  {renderFeatureIcon(feature.icon)}
                </div>
                <h3 className="font-extrabold text-base text-[#1A1A2E]">{feature.title}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-light flex-grow">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Flow */}
      <section className="bg-white py-16 md:py-24 relative overflow-hidden" id="how-it-works">
        
        {/* Background blobs for depth */}
        <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-sky-200/20 rounded-full blur-[80px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[#4A5FE8] text-xs uppercase tracking-widest font-black">HOW IT WORKS</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1A1A2E]">
              From booking confirmation to consultation in 4 steps
            </h2>
            <p className="text-[#1A1A2E]/70 font-normal">
              No guesswork or manual registry sheets. Just reliable visual streams that let you spend clinical wait times in comfort outside of congested waiting halls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="text-center space-y-4 relative">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-xl font-black text-[#4A5FE8] shadow-sm relative">
                1
                <span className="hidden lg:block absolute left-[80px] top-1/2 w-[80px] h-0.5 border-t-2 border-dashed border-indigo-150 -translate-y-1/2" />
              </div>
              <h3 className="font-extrabold text-lg text-[#1A1A2E]">Choose Specialty</h3>
              <p className="text-sm text-[#1A1A2E]/70 max-w-[200px] mx-auto font-light leading-relaxed">
                Search via doctor list, check real-time availability score.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4 relative">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-xl font-black text-[#4A5FE8] shadow-sm relative">
                2
                <span className="hidden lg:block absolute left-[80px] top-1/2 w-[80px] h-0.5 border-t-2 border-dashed border-indigo-150 -translate-y-1/2" />
              </div>
              <h3 className="font-extrabold text-lg text-[#1A1A2E]">Pick Live Slot</h3>
              <p className="text-sm text-[#1A1A2E]/70 max-w-[200px] mx-auto font-light leading-relaxed">
                Secure color-coded timeslots suited for your lifestyle.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4 relative">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-xl font-black text-[#4A5FE8] shadow-sm relative">
                3
                <span className="hidden lg:block absolute left-[80px] top-1/2 w-[80px] h-0.5 border-t-2 border-dashed border-indigo-150 -translate-y-1/2" />
              </div>
              <h3 className="font-extrabold text-lg text-[#1A1A2E]">Get Live Status</h3>
              <p className="text-sm text-[#1A1A2E]/70 max-w-[200px] mx-auto font-light leading-relaxed">
                Follow your visual gauge in real time as the clinician moves.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center space-y-4 relative">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#1A1A2E] flex items-center justify-center text-xl font-black text-white shadow-md">
                4
              </div>
              <h3 className="font-extrabold text-lg text-[#1A1A2E]">Walk In on Time</h3>
              <p className="text-sm text-[#1A1A2E]/70 max-w-[200px] mx-auto font-light leading-relaxed">
                Receive a prompt, walk directly to your session. No crowded queues.
              </p>
            </div>

          </div>

          {/* Quick interactive shortcut */}
          <div className="mt-14 flex justify-center">
            <button 
              onClick={() => onNavigate('/patient/book')}
              className="px-6 py-3 bg-[#4A5FE8] text-white text-sm font-semibold rounded-full hover:bg-opacity-90 tracking-wide transition-all shadow-md"
            >
              Start Your First Booking
            </button>
          </div>

        </div>
      </section>

      {/* For Doctors/Hospitals Pitch with Dashboard Mockup Preview */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20" id="doctors-section">
        <div className="bg-slate-900 text-white rounded-[32px] p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-slate-800">
          
          {/* Subtle decor for inner grid */}
          <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[100px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Pitch Text Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-indigo-400 font-extrabold uppercase text-xs tracking-widest block bg-blue-950/50 w-fit px-3.5 py-1.5 rounded-full border border-blue-900">
                For Clinians & Ward Managers
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Manage your patient flow. Reduce clinical overhead. No complexity.
              </h2>
              <p className="text-slate-400 leading-relaxed font-light">
                QueueCare supplies state-of-the-art dashboards for nursing desks, reception kiosks, and professional practitioners. Watch the line flow, trigger automatic SMS calls for subsequent patients, and access structured logs to optimize treatment times.
              </p>

              {/* Pitch bullet highlights */}
              <ul className="space-y-3 pt-2 text-sm text-slate-300 font-medium">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                  <span>Interactive Doctor Console: Call next client in 1 click</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                  <span>Auto-updated Estimated Treatment Speeds</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                  <span>Robust HIPAA compliance with audited metadata logs</span>
                </li>
              </ul>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('/doctor/dashboard')}
                  className="px-6 py-3 bg-[#4A5FE8] text-white text-sm font-bold rounded-full hover:bg-indigo-600 transition-all flex items-center space-x-2"
                  id="landing-doctors-dashboard-btn"
                >
                  <span>Launch Doctor Demo Console</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Micro Dashboard Kiosk Mockup on landing page */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="w-full bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-3xl text-xs space-y-4">
                
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <div className="flex items-center space-x-2 text-slate-200">
                    <Stethoscope className="h-4.5 w-4.5 text-[#4A5FE8]" />
                    <span className="font-extrabold">QueueCare Desk (Kiosk Pitch)</span>
                  </div>
                  <span className="px-2 py-0.5 bg-indigo-950 text-indigo-400 font-bold rounded">Console V2.4</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                    <p className="text-slate-500 text-[9px] font-semibold">TODAY PATIENTS</p>
                    <p className="text-base text-white font-extrabold">18</p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                    <p className="text-slate-500 text-[9px] font-semibold">AVERAGE OVERHEAD</p>
                    <p className="text-base text-indigo-400 font-extrabold text-blue-400">11m</p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                    <p className="text-slate-500 text-[9px] font-semibold">STATION CAPACITY</p>
                    <p className="text-base text-emerald-400 font-extrabold">95%</p>
                  </div>
                </div>

                {/* Queue list table row preview */}
                <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-850/50 space-y-2">
                  <p className="font-bold text-[10px] text-slate-400">Active Treating Line</p>
                  
                  <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg text-slate-350">
                    <span>1. Emma Watson</span>
                    <span className="bg-slate-850 px-2 py-0.5 rounded text-slate-400 text-[9px]">Completed</span>
                  </div>

                  <div className="flex justify-between items-center bg-indigo-950/20 p-2 border border-indigo-950/50 rounded-lg text-white">
                    <span className="font-bold">2. John Doe</span>
                    <span className="bg-[#4A5FE8] text-white px-2 py-0.5 rounded text-[9px] font-extrabold animate-pulse">Treating</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg text-slate-400">
                    <span>3. Swapnali Mandave</span>
                    <span className="text-amber-400 text-[9px] font-bold">Waiting (#3)</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 text-[10px] text-slate-500 font-light">
                  <span>Auto-sync with Patient Mobile Gauges: Active</span>
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full" />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-transparent py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[#4A5FE8] text-xs uppercase tracking-widest font-black">TESTIMONIAL STORIES</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1A1A2E]">
            Verified relief from physical clinic queues
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx}
              className="bg-white/90 p-6 rounded-[20px] shadow-sm flex flex-col justify-between border border-indigo-50 relative"
              id={`testimonial-card-${idx}`}
            >
              {/* Quotes graphics */}
              <div className="text-6xl text-indigo-150 font-serif absolute top-3 left-3 select-none leading-none pointer-events-none">“</div>
              
              <div className="space-y-4 relative z-10 pt-4">
                {/* Rating rating */}
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(t.rating) ? 'fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic font-light font-sans">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-indigo-50/70 mt-6 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-[#4A5FE8] uppercase">
                  {t.author[0] + t.author[1]}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#1A1A2E]">{t.author}</h4>
                  <p className="text-[10px] text-[#4A5FE8] font-bold uppercase">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner: closing signup push */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[28px] overflow-hidden bg-[#1A1A2E] text-white p-8 md:p-12 text-center shadow-xl">
          <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[350px] h-[150px] bg-[#4A5FE8]/30 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest block">JOIN THE MOVEMENT</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Ready to terminate clinical friction?
            </h2>
            <p className="text-slate-300 font-light text-sm md:text-base leading-relaxed">
              Sign up today to configure your personal patient profile, save medical history, and gain access to priority digital tickets instantly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('/signup')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#4A5FE8] text-white font-bold rounded-full hover:bg-opacity-95 hover:scale-[1.02] transition-all shadow-md cursor-pointer"
                id="landing-cta-signup"
              >
                Create Free Account
              </button>
              <button
                onClick={() => onNavigate('/patient/book')}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 text-slate-300 hover:text-white font-bold rounded-full hover:bg-slate-750 transition-all cursor-pointer"
                id="landing-cta-browse-docs"
              >
                Browse Doctors List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer is embedded in App.tsx or parent container */}
    </div>
  );
}
