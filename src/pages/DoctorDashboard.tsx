import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Clock, CheckCircle2, UserCheck, Stethoscope, Play, AlertCircle,
  TrendingUp, Sparkles, Plus, History, LogOut, ArrowRight, Activity, RotateCcw, Hospital
} from 'lucide-react';
import { QueueItem } from '../types';
import { useTheme } from '../ThemeContext';

interface DoctorDashboardProps {
  queueList: QueueItem[];
  onUpdateQueueStatus: (id: string, newStatus: 'Waiting' | 'In-Progress' | 'Done') => void;
  onAdvanceQueue: (hospital: string, doctorId: string) => void;
  onResetQueue: () => void;
  onAddPatientToQueue: (name: string, symptoms: string, hospital: string, doctorId: string) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

export default function DoctorDashboard({
  queueList,
  onUpdateQueueStatus,
  onAdvanceQueue,
  onResetQueue,
  onAddPatientToQueue,
  addToast
}: DoctorDashboardProps) {
  const { colors, isDark } = useTheme();

  // Multi-hospital affiliation simulation (Doctor works at General and Cardiac centers)
  const [activeHospital, setActiveHospital] = useState<'QueueCare General Hospital' | 'Heart & Vascular Center'>('QueueCare General Hospital');

  // Inline forms for adding a patient to the live queue
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientSymptoms, setNewPatientSymptoms] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter queue records strictly to activeHospital and active doctor (Dr. Robert Chen, ID 'doc-4')
  const doctorQueue = queueList.filter(q => q.doctorId === 'doc-4' && q.hospital === activeHospital);

  // Compute calculated metrics
  const totalToday = doctorQueue.length;
  const completedCount = doctorQueue.filter(q => q.status === 'Done').length;
  const remainingCount = doctorQueue.filter(q => q.status === 'Waiting' || q.status === 'In-Progress').length;
  const activePatientName = doctorQueue.find(q => q.status === 'In-Progress')?.patientName || 'None In-Progress';
  
  // Calculate average wait time (simulated average of 8 minutes per patient checked)
  const averageWaitTime = remainingCount > 0 ? `${remainingCount * 8} mins` : '0 mins';

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    onAddPatientToQueue(
      newPatientName, 
      newPatientSymptoms || 'Routine follow-up',
      activeHospital,
      'doc-4'
    );
    addToast(`Added ${newPatientName} to the live ticket line at ${activeHospital}!`, "success");
    setNewPatientName('');
    setNewPatientSymptoms('');
    setShowAddForm(false);
  };

  return (
    <div className={`min-h-screen py-8 ${colors.bgMain}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner with Doctor branding and quick toggles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-[#4A5FE8] dark:text-blue-400 font-black text-xs uppercase tracking-widest">
              <Activity className="h-4 w-4 text-[#4A5FE8] animate-pulse" />
              <span>Attending Physician Live Terminal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1" id="doctor-title">
              Dr. Robert Chen, MD
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Attending General Practitioner • Ward Kiosk Desk 3
            </p>
          </div>

          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => {
                onResetQueue();
                addToast("Queue system reset back to initial clinical slots!", "info");
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-850 bg-white hover:bg-slate-50 dark:bg-slate-900 text-[#1A1A2E] dark:text-slate-300 text-xs font-bold rounded-full transition-all flex items-center space-x-2"
              title="Return demonstration parameters back to default state"
              id="reset-queue-button"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Line Sim</span>
            </button>

            <button
              onClick={() => {
                onAdvanceQueue(activeHospital, 'doc-4');
                addToast(`Next patient summoned for ${activeHospital}! Wait-lines successfully advanced.`, "success");
              }}
              className="px-5 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-indigo-600 dark:hover:bg-blue-700 text-white text-xs font-black rounded-full shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
              id="global-advance-queue-button"
            >
              <Sparkles className="h-4 w-4 " />
              <span>Call Next Patient</span>
            </button>
          </div>
        </div>

        {/* Dynamic Affiliation Selector Tabs (Works across multiple clinics) */}
        <div className="bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl mb-8 flex flex-col sm:flex-row gap-2 max-w-2xl border border-slate-200/50 dark:border-slate-850">
          <button
            onClick={() => {
              setActiveHospital('QueueCare General Hospital');
              addToast("Switched queue dashboard to QueueCare General Hospital", "info");
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-tight flex items-center justify-center space-x-2 transition-all ${
              activeHospital === 'QueueCare General Hospital'
                ? 'bg-[#4A5FE8] text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            <Hospital className="h-4 w-4" />
            <span>QueueCare General Hospital</span>
            <span className="ml-1.5 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-current">
              {queueList.filter(q => q.doctorId === 'doc-4' && q.hospital === 'QueueCare General Hospital' && q.status !== 'Done').length} waiting
            </span>
          </button>
          <button
            onClick={() => {
              setActiveHospital('Heart & Vascular Center');
              addToast("Switched queue dashboard to Heart & Vascular Center", "info");
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-tight flex items-center justify-center space-x-2 transition-all ${
              activeHospital === 'Heart & Vascular Center'
                ? 'bg-[#4A5FE8] text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            <Hospital className="h-4 w-4" />
            <span>Heart & Vascular Center</span>
            <span className="ml-1.5 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-current">
              {queueList.filter(q => q.doctorId === 'doc-4' && q.hospital === 'Heart & Vascular Center' && q.status !== 'Done').length} waiting
            </span>
          </button>
        </div>

        {/* Dynamic Metric Grid cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 shadow-sm border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Patients Registered</p>
              <Users className="h-4 w-4 text-[#4A5FE8]" />
            </div>
            <p className="text-2xl md:text-3xl font-black mt-1.5 text-slate-900 dark:text-white">{totalToday}</p>
            <span className="text-[10px] text-slate-400 font-light block mt-0.5">Today's total triaged list</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 shadow-sm border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Remaining line</p>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl md:text-3xl font-black mt-1.5 text-amber-600 dark:text-amber-400">{remainingCount}</p>
            <span className="text-[10px] text-slate-400 font-light block mt-0.5">Awaiting active summon</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 shadow-sm border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sessions Treated</p>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl md:text-3xl font-black mt-1.5 text-emerald-600 dark:text-emerald-400">{completedCount}</p>
            <span className="text-[10px] text-slate-400 font-light block mt-0.5">Marked done by clinician</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 shadow-sm border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Est. Waiting Ceiling</p>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl md:text-3xl font-black mt-1.5 text-blue-600 dark:text-blue-400">{averageWaitTime}</p>
            <span className="text-[10px] text-slate-400 font-light block mt-0.5">Based on 8m medical cycles</span>
          </div>

        </div>

        {/* Master splitting Layout: Table left side, Diagnostic controls right side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main triaged database queue lists table */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-indigo-50 dark:border-slate-800 mb-6">
              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Active Doctor Consultation Registry</h2>
                <p className="text-xs text-slate-500">Call, manage, or change patient medical statuses online</p>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="text-xs font-semibold text-slate-500">Live Kiosk Linked</span>
              </div>
            </div>

            {/* Custom styled list for perfect standard responsive viewport layout */}
            <div className="space-y-3">
              {doctorQueue.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <AlertCircle className="h-10 w-10 text-slate-350 mx-auto" />
                  <p className="text-sm font-semibold text-slate-500">The registry queue is currently vacant for {activeHospital}.</p>
                </div>
              ) : (
                doctorQueue.map((patient) => {
                  const isDone = patient.status === 'Done';
                  const isWriting = patient.status === 'In-Progress';
                  const isWaiting = patient.status === 'Waiting';

                  let statusBadgeStyle = '';
                  if (isDone) {
                    statusBadgeStyle = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-250';
                  } else if (isWriting) {
                    statusBadgeStyle = 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 animate-pulse';
                  } else {
                    statusBadgeStyle = 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200';
                  }

                  return (
                    <div 
                      key={patient.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                        isWriting 
                          ? 'bg-blue-50/40 border-[#4A5FE8] dark:bg-indigo-950/10' 
                          : 'bg-white hover:bg-slate-50 border-slate-100 dark:bg-slate-900 dark:border-slate-800'
                      }`}
                      id={`doctor-queue-row-${patient.id}`}
                    >
                      {/* Name Details, Symptoms complaints column */}
                      <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                        <div className={`p-2 rounded-xl text-center shrink-0 w-11 h-11 flex flex-col justify-center items-center ${
                          isWriting 
                            ? 'bg-[#4A5FE8] text-white' 
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          <span className="text-[9px] font-semibold leading-none uppercase text-slate-400">POS</span>
                          <span className="text-sm font-black mt-0.5 leading-none">
                            {patient.position > 0 ? `#${patient.position}` : '-'}
                          </span>
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                              {patient.patientName}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">({patient.patientAge}y)</span>
                          </div>
                          
                          <p className="text-xs text-slate-400 truncate leading-relaxed">
                            🤒 Complaints: <strong className="font-normal text-slate-650 dark:text-slate-300">{patient.symptoms}</strong>
                          </p>

                          <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-semibold">
                            <span>Slot time: {patient.timeSlot}</span>
                            <span>•</span>
                            <span className="text-[#4A5FE8] dark:text-blue-400">Doctor Cabinet 3</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badges + Custom buttons per row */}
                      <div className="flex items-center justify-between sm:justify-start gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded ${statusBadgeStyle}`}>
                          {patient.status === 'In-Progress' ? '🧑‍⚕️ TREATING' : patient.status}
                        </span>

                        <div className="flex items-center space-x-2">
                          {isWaiting && (
                            <button
                              onClick={() => {
                                onUpdateQueueStatus(patient.id, 'In-Progress');
                                addToast(`Summoned ${patient.patientName}! Status changed to Treating.`, "success");
                              }}
                              className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-[11px] font-bold rounded-lg transition-all flex items-center space-x-1"
                              id={`summon-patient-btn-${patient.id}`}
                            >
                              <Play className="h-3 w-3 fill-white" />
                              <span>Summon</span>
                            </button>
                          )}

                          {isWriting && (
                            <button
                              onClick={() => {
                                onUpdateQueueStatus(patient.id, 'Done');
                                addToast(`Marked ${patient.patientName} as triaged! Session finished.`, "success");
                              }}
                              className="px-3.5 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold rounded-lg transition-all flex items-center space-x-1"
                              id={`done-patient-btn-${patient.id}`}
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              <span>Mark Done</span>
                            </button>
                          )}

                          {isDone && (
                            <span className="text-[10px] text-slate-400 font-bold italic flex items-center space-x-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              <span>Completed</span>
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Clinician's Desk Assistant sidebar panels */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick advance control panel widget */}
            <div className="bg-slate-900 text-white rounded-[24px] p-5 shadow-sm border border-slate-850 space-y-4">
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-[#E4E8F7] flex items-center space-x-2">
                <Stethoscope className="h-4.5 w-4.5 text-[#4A5FE8] animate-spin" />
                <span>One-Click Queue Advance</span>
              </h3>
              
              <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                Use the quick trigger to automatically resolve the patient currently inside clinical offices and immediately dial the next expectant user on phone streams.
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1.5 text-xs text-slate-300">
                <p className="text-slate-500 text-[10px] font-semibold">Active Session:</p>
                <p className="font-black text-white">{activePatientName}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    onAdvanceQueue(activeHospital, 'doc-4');
                    addToast(`SUMMONING NEXT PATIENT for ${activeHospital}... Success!`, "success");
                  }}
                  className="w-full py-3 bg-[#4A5FE8] hover:bg-indigo-600 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                  id="doctor-summon-next-quick-btn"
                >
                  <Sparkles className="h-4 w-4 text-white" />
                  <span>Call Next Patient Up</span>
                </button>
              </div>
            </div>

            {/* Quick add walk-in patient form */}
            <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
              
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-[#1A1A2E] dark:text-white">
                  Add Walk-In Patient
                </h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-xs text-[#4A5FE8] dark:text-blue-400 font-bold hover:underline"
                >
                  {showAddForm ? 'Cancel' : 'Create Live'}
                </button>
              </div>

              {showAddForm ? (
                <form onSubmit={handleCreatePatient} className="space-y-3.5 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">FullName</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Samuel L. Jackson"
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg border-0 focus:ring-1 focus:ring-[#4A5FE8] outline-none font-semibold text-slate-800 dark:text-slate-200"
                      required
                      id="walkin-patient-name"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Symptoms & Complaints</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Migraine, prescription refill"
                      value={newPatientSymptoms}
                      onChange={(e) => setNewPatientSymptoms(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg border-0 focus:ring-1 focus:ring-[#4A5FE8] outline-none font-semibold text-slate-800 dark:text-slate-200"
                      id="walkin-patient-symptoms"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Insert Walk-In Patient At Tail
                  </button>
                </form>
              ) : (
                <div className="text-center py-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl">
                  <p className="text-xs text-slate-400 font-normal">Need to add someone who walked in?</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="text-xs text-[#4A5FE8] dark:text-blue-400 font-bold hover:underline mt-1"
                    id="doctor-walkin-launcher"
                  >
                    Launch insert template form
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
