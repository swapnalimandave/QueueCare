import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Calendar, Clock, Sparkles, SlidersHorizontal, CheckCircle2, 
  Trash2, Search, ArrowRight, User, History, Laptop, Compass, HeartPulse, Gauge, Bell, HelpCircle
} from 'lucide-react';
import { Doctor, Appointment, QueueItem } from '../types';
import { useTheme } from '../ThemeContext';

interface PatientDashboardProps {
  appointments: Appointment[];
  queueList: QueueItem[];
  onNavigate: (path: string) => void;
  onCancelAppointment: (id: string) => void;
  patientName: string;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

export default function PatientDashboard({
  appointments,
  queueList,
  onNavigate,
  onCancelAppointment,
  patientName,
  addToast
}: PatientDashboardProps) {
  const { colors, isDark } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'history' | 'profile'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotificationPref, setShowNotificationPref] = useState(true);

  // Find user's active queue appointment from list (if any)
  const activeAppt = appointments.find(a => a.status === 'Confirmed' && a.queuePos !== undefined);
  
  // Calculate dynamic average queue properties
  // Find current position of active patient in the queue list
  const userQueueItem = queueList.find(q => q.patientName.toLowerCase().includes(patientName.toLowerCase()) || q.patientName.includes('You'));
  const userQueuePos = userQueueItem && userQueueItem.status === 'Waiting' ? userQueueItem.position : (activeAppt?.queuePos || 0);
  const currentEstWaitMinutes = userQueuePos > 0 ? (userQueuePos * 8) : 0;

  // Simulate Skeleton Loading when tab changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleSimulateSkeleton = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  // Helper to render skeleton cards
  const renderSkeletons = () => (
    <div className="space-y-4 animate-pulse">
      {[1, 2].map(n => (
        <div key={n} className="bg-white dark:bg-slate-800 p-5 rounded-2xl space-y-3 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-3 bg-slate-100 dark:bg-slate-750 rounded w-1/4" />
            </div>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-750 rounded w-3/4" />
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-full pt-1" />
        </div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen py-8 ${colors.bgMain}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Greetings */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight" id="patient-greeting-title">
              Hello, <span className="text-[#4A5FE8] dark:text-blue-400">{patientName}</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Welcome to your digital outpatient patient center. View real-time treatment streams.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSimulateSkeleton}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#1A1A2E] dark:text-slate-300 rounded-full text-xs font-bold hover:bg-slate-50 transition-all flex items-center space-x-1.5"
              title="Inspect skeleton loaders"
              id="simulate-skeleton-btn"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Diagnose Loading</span>
            </button>
            
            <button
              onClick={() => onNavigate('/patient/book')}
              className="px-5 py-2.5 bg-[#4A5FE8] hover:bg-indigo-600 text-white rounded-full text-xs font-bold shadow-md shadow-indigo-200 dark:shadow-none flex items-center space-x-1.5 transition-all"
              id="patient-dashboard-new-booking-btn"
            >
              <Plus className="h-4 w-4" />
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        {/* Outer Grid layout: Left Sidebar, Right Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Menu Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 shadow-sm space-y-1 border border-slate-100 dark:border-slate-800">
              
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-3 px-3">
                Patient Account
              </p>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#4A5FE8] text-white shadow-md shadow-indigo-100 dark:shadow-none'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                id="sidebar-tab-dashboard"
              >
                <Gauge className="h-4 w-4" />
                <span>Queue Monitor</span>
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'appointments'
                    ? 'bg-[#4A5FE8] text-white shadow-md shadow-indigo-100 dark:shadow-none'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                id="sidebar-tab-appointments"
              >
                <Calendar className="h-4 w-4" />
                <span>My Appointments</span>
                <span className="ml-auto bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-black">
                  {appointments.filter(a => a.status === 'Confirmed').length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'history'
                    ? 'bg-[#4A5FE8] text-white shadow-md shadow-indigo-100 dark:shadow-none'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                id="sidebar-tab-history"
              >
                <History className="h-4 w-4" />
                <span>Medical History</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#4A5FE8] text-white shadow-md shadow-indigo-100 dark:shadow-none'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                id="sidebar-tab-profile"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </button>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-[#4A5FE8]/5 dark:bg-indigo-950/20 rounded-xl p-3 text-xs text-[#4A5FE8] dark:text-indigo-400 space-y-2">
                  <p className="font-extrabold flex items-center">
                    <HeartPulse className="h-3.5 w-3.5 mr-1" />
                    <span>Emergency Care?</span>
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                    QueueCare is for scheduled primary and subspecialty triage. If you feel severe immediate symptoms, dial <strong className="text-slate-700 dark:text-slate-300">911</strong> immediately.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Dynamic Tab Panel Content */}
          <div className="lg:col-span-3 space-y-6">
            
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 space-y-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                      <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-full w-32 mx-auto" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mx-auto" />
                    </div>
                    {renderSkeletons()}
                  </div>
                </motion.div>
              ) : activeTab === 'dashboard' ? (
                <motion.div
                  key="dashboard-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8"
                >
                  
                  {/* LEFT: Live circular gauge panel */}
                  <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden flex flex-col justify-between">
                    
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                            Live Queue Monitor
                          </h2>
                          <p className="text-xs text-slate-500 font-medium">
                            Auto-syncing with clinical workflow status
                          </p>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      </div>

                      {/* Estimated wait Ring widget */}
                      <div className="my-8 flex flex-col items-center justify-center">
                        <div className="relative w-48 h-48">
                          
                          {/* Radial Progress Ring SVG */}
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Inner Gray Background circle */}
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="42" 
                              fill="transparent" 
                              stroke="#F0F3FD" 
                              className="dark:stroke-slate-800"
                              strokeWidth="7.5"
                            />
                            {/* Progress bar */}
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="42" 
                              fill="transparent" 
                              stroke={userQueuePos > 0 ? "#4A5FE8" : "#10B981"} 
                              strokeWidth="7.5"
                              strokeDasharray="264"
                              strokeDashoffset={userQueuePos > 0 ? (264 - (264 * Math.min(8, userQueuePos)) / 8) : 264}
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                            />
                          </svg>

                          {/* Digital read-out overlay inside circle */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            {userQueuePos > 0 ? (
                              <>
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Est. Wait</span>
                                <span className="text-3xl font-black text-slate-900 dark:text-white my-1">{currentEstWaitMinutes}m</span>
                                <span className="text-[11px] text-[#4A5FE8] dark:text-blue-400 font-extrabold">Position #{userQueuePos}</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-8 w-8 text-emerald-500 my-1.5" />
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">It's your turn!</span>
                                <span className="text-[10px] text-slate-400 mt-0.5">Please walk inside</span>
                              </>
                            )}
                          </div>

                        </div>
                      </div>

                      {/* Live Queue list card reference */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2.5">
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                          <span>Waiting Patient List</span>
                          <span>Positions Shown</span>
                        </div>

                        <div className="space-y-1.5">
                          {queueList.slice(0, 4).map((patient, pIdx) => {
                            const isMe = patient.patientName.includes('Swapnali') || patient.patientName.includes('You');
                            return (
                              <div 
                                key={patient.id} 
                                className={`flex justify-between items-center px-3 py-2 rounded-lg text-xs ${
                                  isMe
                                    ? 'bg-[#4A5FE8]/10 text-[#4A5FE8] border border-[#4A5FE8]/25 dark:bg-blue-950/40 dark:text-blue-300' 
                                    : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <span className="font-bold">{patient.patientName}</span>
                                <span className="font-mono text-[11px]">
                                  {patient.status === 'In-Progress' 
                                    ? 'Being Treated 🧑‍⚕️' 
                                    : patient.status === 'Done' 
                                      ? 'Completed ✅' 
                                      : `Waiting (No. ${patient.position})`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Footer cue inside Card */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mt-4">
                      <span>Refreshed 1 mins ago</span>
                      <button 
                        onClick={() => addToast("Forced clinical queue synched successfully", "info")}
                        className="text-[#4A5FE8] dark:text-blue-400 hover:underline font-bold"
                      >
                        Force Sync Now
                      </button>
                    </div>

                  </div>

                  {/* RIGHT: Active Appointments and Book Quick Link */}
                  <div className="md:col-span-5 space-y-6">
                    
                    {/* Position alert toast simulation banner */}
                    <div className="bg-[#1A1A2E] text-white p-5 rounded-[20px] shadow-md relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#4A5FE8]/20 rounded-full blur-xl" />
                      <div className="flex items-start space-x-3.5 relative z-10">
                        <div className="p-2.5 bg-[#4A5FE8] rounded-xl text-white shrink-0">
                          <Bell className="h-5 w-5 text-white animate-swing" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-[#E4E8F7] text-sm">Smart Queue Notice</h4>
                          <p className="text-xs text-slate-350 leading-relaxed font-light">
                            {userQueuePos > 0 && userQueuePos <= 3
                              ? "You are highly advised to stay close! Your queue position is under #3."
                              : userQueuePos > 3
                                ? `Estimated wait time is ${currentEstWaitMinutes} minutes. We will text you 10 mins before your slot.`
                                : "The doctor is calling for Swapnali Mandave. Please report immediately at Station 3!"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Appointment list */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-extrabold text-base text-[#1A1A2E] dark:text-white">
                          My Active Schedulers
                        </h3>
                        <span className="text-xs font-semibold text-slate-400">
                          {appointments.filter(a => a.status === 'Confirmed').length} pending
                        </span>
                      </div>

                      <div className="space-y-3">
                        {appointments.filter(a => a.status === 'Confirmed').length === 0 ? (
                          <div className="text-center py-8 text-slate-450 space-y-2">
                            <Calendar className="h-8 w-8 mx-auto text-slate-300" />
                            <p className="text-xs font-medium">You have no active appointments booked.</p>
                            <button
                              onClick={() => onNavigate('/patient/book')}
                              className="text-xs text-[#4A5FE8] font-bold hover:underline"
                            >
                              Browse available doctors list
                            </button>
                          </div>
                        ) : (
                          appointments
                            .filter(a => a.status === 'Confirmed')
                            .map((appt) => (
                              <div 
                                key={appt.id}
                                className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-750 flex flex-col justify-between space-y-3"
                              >
                                <div className="flex items-start space-x-3">
                                  <img 
                                    className="h-10 w-10 rounded-full object-cover shrink-0 bg-slate-200"
                                    src={appt.doctorImage} 
                                    alt={appt.doctorName}
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-extrabold text-sm text-[#1A1A2E] dark:text-white truncate">
                                      {appt.doctorName}
                                    </h4>
                                    <p className="text-[11px] text-[#4A5FE8] dark:text-blue-400 font-bold uppercase tracking-wider">
                                      {appt.doctorSpecialty}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
                                  <span className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 text-slate-400 mr-1" />
                                    <span>{appt.date}</span>
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 text-slate-400 mr-1" />
                                    <span>{appt.time}</span>
                                  </span>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-indigo-50/50">
                                  <span className="bg-indigo-100 text-[#4A5FE8] dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded">
                                    {appt.queuePos ? `Queue Pos: #${appt.queuePos}` : 'Scheduled'}
                                  </span>

                                  <button
                                    onClick={() => onCancelAppointment(appt.id)}
                                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
                                    id={`cancel-appt-btn-${appt.id}`}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Cancel</span>
                                  </button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>

                      {/* Quick direct book banner */}
                      <div className="bg-gradient-to-tr from-[#4A5FE8] to-indigo-600 rounded-xl p-4 text-white space-y-2 mt-4">
                        <p className="font-black text-sm">Need a checkup on something else?</p>
                        <p className="text-[11px] text-indigo-100 leading-relaxed font-light">
                          Select from 5+ experienced consultants and configure a guaranteed slot for tomorrow.
                        </p>
                        <button
                          onClick={() => onNavigate('/patient/book')}
                          className="pt-1.5 flex items-center space-x-1 text-xs text-[#E4E8F7] font-extrabold hover:underline"
                        >
                          <span>Go to slot planner</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                    </div>

                  </div>

                </motion.div>
              ) : activeTab === 'appointments' ? (
                <motion.div
                  key="appointments-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-indigo-50 dark:border-slate-800">
                    <div>
                      <h2 className="font-extrabold text-xl text-slate-900 dark:text-white">My Active Bookings</h2>
                      <p className="text-xs text-slate-500">Track and manage your upcoming treatment visits</p>
                    </div>
                  </div>

                  {appointments.filter(a => a.status === 'Confirmed').length === 0 ? (
                    <div className="text-center py-12 text-slate-450 space-y-4">
                      <Calendar className="h-12 w-12 mx-auto text-slate-300" />
                      <p className="text-sm font-semibold text-slate-500">No active scheduled treatments discovered.</p>
                      <button
                        onClick={() => onNavigate('/patient/book')}
                        className="px-6 py-2.5 bg-[#4A5FE8] text-white font-bold text-xs rounded-full hover:bg-opacity-95"
                      >
                        Book Your First Consultation Slot
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {appointments
                        .filter(a => a.status === 'Confirmed')
                        .map((appt) => (
                          <div 
                            key={appt.id}
                            className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-black rounded-full">
                                {appt.status}
                              </span>
                              {appt.queuePos && (
                                <span className="bg-indigo-50 text-[#4A5FE8] dark:bg-blue-950 text-[10px] font-black uppercase px-2.5 py-1 rounded">
                                  Position #{appt.queuePos}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-3.5">
                              <img 
                                className="h-12 w-12 rounded-full object-cover border border-slate-200"
                                src={appt.doctorImage} 
                                alt={appt.doctorName}
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h3 className="font-black text-sm text-[#1A1A2E] dark:text-white">
                                  {appt.doctorName}
                                </h3>
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                  {appt.doctorSpecialty}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-xl text-xs font-semibold text-slate-600">
                              <div>
                                <p className="text-[10px] text-slate-400">DATE</p>
                                <p className="text-slate-800 dark:text-slate-200 mt-0.5">{appt.date}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400">TIME SLOT</p>
                                <p className="text-slate-800 dark:text-slate-200 mt-0.5">{appt.time}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <button
                                onClick={() => {
                                  addToast("Appointment added to digital phone calendar!", "success");
                                }}
                                className="text-slate-500 hover:text-[#4A5FE8] text-xs font-bold transition-colors flex items-center space-x-1"
                              >
                                <Plus className="h-4 w-4" />
                                <span>Add to Calendar</span>
                              </button>

                              <button
                                onClick={() => onCancelAppointment(appt.id)}
                                className="text-rose-500 hover:text-rose-600 text-xs font-extrabold flex items-center space-x-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Cancel Booking</span>
                              </button>
                            </div>

                          </div>
                        ))}
                    </div>
                  )}
                </motion.div>
              ) : activeTab === 'history' ? (
                <motion.div
                  key="history-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-indigo-50 dark:border-slate-800">
                    <div>
                      <h2 className="font-extrabold text-xl text-slate-900 dark:text-white">Past Treatment Chapters</h2>
                      <p className="text-xs text-slate-500">Historic logs of clinics, prescriptions, and status</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Render static completed sessions + newly completed ones if any */}
                    <div className="relative pl-6 border-l-2 border-dashed border-indigo-100 dark:border-slate-800 space-y-6">
                      
                      <div className="relative">
                        <div className="absolute -left-[30px] top-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-sm text-[#1A1A2E] dark:text-white">Dr. Sarah Jenkins</span>
                            <span className="text-[10px] text-slate-400">June 15, 2026</span>
                          </div>
                          <p className="text-xs text-[#4A5FE8] dark:text-indigo-400 font-bold uppercase">Pediatrics / Throat Irritation</p>
                          <p className="text-xs text-slate-500 leading-relaxed font-light">
                            Diagnosed: Chronic pharyngitis. Advised warm saltwater gargles and prescribed antihistamines for seasonal relief.
                          </p>
                          <div className="text-[10px] text-slate-400 pt-1 border-t border-indigo-100/40">
                            Status: <strong className="text-emerald-500 font-semibold">Completed Successfully</strong>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[30px] top-1 bg-slate-400 text-white rounded-full p-1 border-2 border-white">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-sm text-[#1A1A2E] dark:text-white">Dr. Emily Vance</span>
                            <span className="text-[10px] text-slate-400">May 22, 2026</span>
                          </div>
                          <p className="text-xs text-[#4A5FE8] dark:text-indigo-400 font-bold uppercase">Dermatology / Skin Rash</p>
                          <p className="text-xs text-slate-500 leading-relaxed font-light">
                            Diagnosed: Contact dermatitis from synthetic detergent. Advised mild steroid gel and replacement with organic cleaning soap. Fully healed.
                          </p>
                          <div className="text-[10px] text-slate-400 pt-1 border-t border-indigo-100/40">
                            Status: <strong className="text-[#1A1A2E] dark:text-slate-350 font-semibold">Completed</strong>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-blue-100 text-[#4A5FE8] rounded-full flex items-center justify-center font-black text-2xl uppercase shadow-inner">
                      {patientName[0] || 'S'}
                    </div>
                    <div>
                      <h2 className="font-extrabold text-xl text-slate-900 dark:text-white">{patientName}</h2>
                      <p className="text-xs text-slate-400 font-semibold">Registered Patient ID: #QC-953472</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-indigo-50 dark:border-slate-800">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Primary Registered Email</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">swapnali.mandave@cumminscollege.in</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Cellular Mobile Number</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">+1 (415) 555-0814</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Current Vital Indicators</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Blood Type: O-Positive | BP: 120/80</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Known Drug Allergies</p>
                      <p className="text-sm font-bold text-rose-500">Penicillin Resistant Allergens</p>
                    </div>
                  </div>

                  <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-xl space-y-3">
                    <p className="text-xs text-slate-600 dark:text-slate-350 font-bold">Preferences & System Routing</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-light">Receive automated SMS wait-alerts before next medical treatment</span>
                      <input 
                        type="checkbox" 
                        checked={showNotificationPref} 
                        onChange={() => {
                          setShowNotificationPref(!showNotificationPref);
                          addToast("Notification preferences updated!", "success");
                        }}
                        className="h-4 w-4 text-[#4A5FE8] focus:ring-[#4A5FE8] border-slate-300 rounded shrink-0"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}
