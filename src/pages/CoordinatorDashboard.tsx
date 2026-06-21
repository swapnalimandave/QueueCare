import React, { useState } from 'react';
import { 
  Users, Clock, CheckCircle2, RefreshCw, ArrowUp, ArrowDown, UserPlus,
  Shield, Activity, Settings, Filter, Search, Edit2, Hospital, Play, Star
} from 'lucide-react';
import { QueueItem, Doctor, Appointment } from '../types';
import { useTheme } from '../ThemeContext';

interface CoordinatorDashboardProps {
  queueList: QueueItem[];
  doctors: Doctor[];
  appointments: Appointment[];
  onUpdateQueueList: (newQueueList: QueueItem[]) => void;
  onUpdateQueueStatus: (id: string, newStatus: 'Waiting' | 'In-Progress' | 'Done') => void;
  onAddPatientToQueue: (name: string, symptoms: string, hospital: string, doctorId: string) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

export default function CoordinatorDashboard({
  queueList,
  doctors,
  appointments,
  onUpdateQueueList,
  onUpdateQueueStatus,
  onAddPatientToQueue,
  addToast
}: CoordinatorDashboardProps) {
  const { colors, isDark } = useTheme();

  const [filterHospital, setFilterHospital] = useState<string>('All');
  const [filterDoctor, setFilterDoctor] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Walk-in patient form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinAge, setWalkinAge] = useState('');
  const [walkinSymptoms, setWalkinSymptoms] = useState('');
  const [walkinDoctor, setWalkinDoctor] = useState(doctors[0]?.id || 'doc-4');

  // Compute stats across the whole database
  const totalPatients = queueList.length;
  const waitingPatients = queueList.filter(q => q.status === 'Waiting').length;
  const inProgressPatients = queueList.filter(q => q.status === 'In-Progress').length;
  const completedPatients = queueList.filter(q => q.status === 'Done').length;

  // Filtered queue items
  const filteredQueue = queueList.filter(item => {
    // Doctor lookup to find their hospital
    const docObj = doctors.find(d => d.id === item.doctorId);
    const itemHospital = item.hospital || docObj?.hospital || 'QueueCare General Hospital';
    
    const matchesHospital = filterHospital === 'All' || itemHospital === filterHospital;
    const matchesDoctor = filterDoctor === 'All' || item.doctorId === filterDoctor;
    const matchesSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesHospital && matchesDoctor && matchesSearch;
  });

  // Reorder Wait-lines Up
  const handleMoveUp = (id: string) => {
    const patientToMove = queueList.find(q => q.id === id);
    if (!patientToMove || patientToMove.status !== 'Waiting') return;

    // Filter waiting patients for the SAME doctor & hospital combo
    const sameGroup = queueList.filter(q => 
      q.status === 'Waiting' && 
      q.doctorId === patientToMove.doctorId && 
      q.hospital === patientToMove.hospital
    );
    const sorted = [...sameGroup].sort((a, b) => a.position - b.position);
    const idx = sorted.findIndex(p => p.id === id);
    if (idx <= 0) {
      addToast(`${patientToMove.patientName} is already first in line for this physician!`, 'info');
      return; 
    }

    const previousPatient = sorted[idx - 1];

    // Swap position indices
    const updatedQueue = queueList.map(item => {
      if (item.id === patientToMove.id) {
        return { ...item, position: previousPatient.position };
      }
      if (item.id === previousPatient.id) {
        return { ...item, position: patientToMove.position };
      }
      return item;
    });

    onUpdateQueueList(updatedQueue);
    addToast(`Priority elevated! ${patientToMove.patientName} moved up.`, "success");
  };

  // Reorder Wait-lines Down
  const handleMoveDown = (id: string) => {
    const patientToMove = queueList.find(q => q.id === id);
    if (!patientToMove || patientToMove.status !== 'Waiting') return;

    const sameGroup = queueList.filter(q => 
      q.status === 'Waiting' && 
      q.doctorId === patientToMove.doctorId && 
      q.hospital === patientToMove.hospital
    );
    const sorted = [...sameGroup].sort((a, b) => a.position - b.position);
    const idx = sorted.findIndex(p => p.id === id);
    if (idx < 0 || idx >= sorted.length - 1) {
      addToast(`${patientToMove.patientName} is already at the end of the line.`, 'info');
      return;
    }

    const nextPatient = sorted[idx + 1];

    // Swap position indices
    const updatedQueue = queueList.map(item => {
      if (item.id === patientToMove.id) {
        return { ...item, position: nextPatient.position };
      }
      if (item.id === nextPatient.id) {
        return { ...item, position: patientToMove.position };
      }
      return item;
    });

    onUpdateQueueList(updatedQueue);
    addToast(`Priority shifted! ${patientToMove.patientName} moved down.`, "info");
  };

  // Reassign to Different Clinician
  const handleReassignDoctor = (id: string, newDocId: string) => {
    const patient = queueList.find(q => q.id === id);
    const targetDoc = doctors.find(d => d.id === newDocId);
    if (!patient || !targetDoc) return;

    // Calculate new position at the tail of targeted doctor waitlist
    const sameGroupWaiting = queueList.filter(q => q.doctorId === newDocId && q.status === 'Waiting');
    const tailPos = sameGroupWaiting.reduce((max, cur) => cur.position > max ? cur.position : max, 0) + 1;

    const updatedQueue = queueList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          doctorId: newDocId,
          hospital: targetDoc.hospital,
          position: item.status === 'Waiting' ? tailPos : 0
        };
      }
      return item;
    });

    onUpdateQueueList(updatedQueue);
    addToast(`Transferred ${patient.patientName} to ${targetDoc.name} (${targetDoc.hospital})`, "success");
  };

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim()) {
      addToast("Please provide the patient name", "warning");
      return;
    }

    const docObj = doctors.find(d => d.id === walkinDoctor);
    const targetHospital = docObj?.hospital || "QueueCare General Hospital";

    onAddPatientToQueue(
      walkinName,
      walkinSymptoms || 'Coordinator Walk-in Consultation',
      targetHospital,
      walkinDoctor
    );

    addToast(`Registered walk-in ${walkinName} successfully!`, 'success');
    setWalkinName('');
    setWalkinSymptoms('');
    setWalkinAge('');
    setShowAddForm(false);
  };

  return (
    <div className={`min-h-screen py-8 ${colors.bgMain}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial style header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-indigo-100 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-[#4A5FE8] dark:text-blue-400 font-black text-xs uppercase tracking-widest">
              <Shield className="h-4 w-4" />
              <span>Coordinator Command Terminal</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mt-1 text-[#1A1A2E] dark:text-white" id="coordinator-title">
              Patient Flow Management
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Consolidated triage database across all affiliated hospitals, clinical cabinets, and practitioners.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-5 py-2.5 bg-[#4A5FE8] hover:bg-indigo-600 text-white rounded-full text-xs font-black shadow-md flex items-center space-x-2 transition-all cursor-pointer"
              id="coordinator-add-walk-in"
            >
              <UserPlus className="h-4 w-4" />
              <span>Triage Walk-In Patient</span>
            </button>
          </div>
        </div>

        {/* High-level Activity Overview Bento Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-450">
              <p className="text-[10px] uppercase font-bold tracking-wider">Total Registers</p>
              <Users className="h-4 w-4 text-[#4A5FE8]" />
            </div>
            <p className="text-3xl font-black mt-2 text-slate-900 dark:text-white">{totalPatients}</p>
            <div className="mt-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: '100%' }}></div>
            </div>
            <span className="text-[9px] text-slate-400 font-bold block mt-1.5">Consolidated flow list</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-amber-500">
              <p className="text-[10px] uppercase font-bold tracking-wider">Remaining Line</p>
              <Clock className="h-4 w-4" />
            </div>
            <p className="text-3xl font-black mt-2 text-amber-600 dark:text-amber-400">{waitingPatients}</p>
            <div className="mt-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${totalPatients > 0 ? (waitingPatients / totalPatients) * 100 : 0}%` }}></div>
            </div>
            <span className="text-[9px] text-slate-400 font-bold block mt-1.5">Awaiting clinic entry</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-blue-500">
              <p className="text-[10px] uppercase font-bold tracking-wider">In consultations</p>
              <Activity className="h-4 w-4 animate-pulse" />
            </div>
            <p className="text-3xl font-black mt-2 text-blue-600 dark:text-blue-400">{inProgressPatients}</p>
            <div className="mt-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${totalPatients > 0 ? (inProgressPatients / totalPatients) * 100 : 0}%` }}></div>
            </div>
            <span className="text-[9px] text-slate-400 font-bold block mt-1.5">Inside practitioner offices</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-emerald-500">
              <p className="text-[10px] uppercase font-bold tracking-wider">Treated Today</p>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="text-3xl font-black mt-2 text-emerald-600 dark:text-emerald-400">{completedPatients}</p>
            <div className="mt-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${totalPatients > 0 ? (completedPatients / totalPatients) * 100 : 0}%` }}></div>
            </div>
            <span className="text-[9px] text-slate-400 font-bold block mt-1.5">Triaged & discharged</span>
          </div>

        </div>

        {/* Walk-in patient creator modal/panel */}
        {showAddForm && (
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-md border border-slate-200/60 dark:border-slate-800 mb-8 max-w-3xl">
            <h3 className="font-extrabold text-base mb-4 text-[#1A1A2E] dark:text-white">Quick Registered Walk-In Triage</h3>
            
            <form onSubmit={handleCreateWalkin} className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-4 space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Patient Name</label>
                <input 
                  type="text" 
                  value={walkinName} 
                  onChange={(e) => setWalkinName(e.target.value)} 
                  placeholder="e.g. Liam Neeson"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 text-xs rounded-xl focus:ring-2 focus:ring-[#4A5FE8] outline-none border-0"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Age (Years)</label>
                <input 
                  type="number" 
                  value={walkinAge} 
                  onChange={(e) => setWalkinAge(e.target.value)} 
                  placeholder="e.g. 48"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 text-xs rounded-xl focus:ring-2 focus:ring-[#4A5FE8] outline-none border-0"
                />
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Physician</label>
                <select 
                  value={walkinDoctor} 
                  onChange={(e) => setWalkinDoctor(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 text-xs rounded-xl focus:ring-2 focus:ring-[#4A5FE8] cursor-pointer outline-none border-0"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Symptoms / Complaint</label>
                <input 
                  type="text" 
                  value={walkinSymptoms} 
                  onChange={(e) => setWalkinSymptoms(e.target.value)} 
                  placeholder="e.g. High fever, fatigue"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 text-xs rounded-xl focus:ring-2 focus:ring-[#4A5FE8] outline-none border-0"
                />
              </div>

              <div className="md:col-span-12 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Triaged Walk-In Now
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter bar and search across all pipelines */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm mb-8 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
            
            {/* Search items */}
            <div className="relative flex items-center flex-1">
              <Search className="absolute left-3 h-4 w-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search patient names, triaged symptoms, complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 text-xs border-0 rounded-xl focus:ring-2 focus:ring-[#4A5FE8] outline-none"
              />
            </div>

            {/* Filter tags select options */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Hospital className="h-4 w-4 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">HOSPITAL</span>
                <select
                  value={filterHospital}
                  onChange={(e) => setFilterHospital(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-850 border-0 rounded-lg text-xs font-semibold cursor-pointer outline-none text-slate-650"
                >
                  <option value="All">All Associated Hospitals</option>
                  <option value="QueueCare General Hospital">QueueCare General Hospital</option>
                  <option value="Heart & Vascular Center">Heart & Vascular Center</option>
                  <option value="Skincare Experts Clinic">Skincare Experts Clinic</option>
                  <option value="Joint & Spine Specialty Clinic">Joint & Spine Specialty Clinic</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">DOCTOR</span>
                <select
                  value={filterDoctor}
                  onChange={(e) => setFilterDoctor(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-850 border-0 rounded-lg text-xs font-semibold cursor-pointer outline-none text-slate-650"
                >
                  <option value="All">All Doctors</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Master Data Stream Grid matching Editorial aesthetic */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          
          <div className="flex justify-between items-center pb-4 border-b border-indigo-50 dark:border-slate-800 mb-6">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Active Queue Flow Registry</h2>
              <p className="text-xs text-slate-500">Live monitoring of patients, order swapping, and reassignments.</p>
            </div>
            <div className="text-xs font-bold text-slate-400">
              Showing {filteredQueue.length} records
            </div>
          </div>

          <div className="space-y-4">
            {filteredQueue.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Activity className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-500">No active queue entries match current search filters.</p>
              </div>
            ) : (
              filteredQueue.map(item => {
                const assignedDoc = doctors.find(d => d.id === item.doctorId);
                const isWaiting = item.status === 'Waiting';
                const isTreating = item.status === 'In-Progress';
                const isDone = item.status === 'Done';

                let statusBadge = '';
                if (isDone) statusBadge = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200';
                else if (isTreating) statusBadge = 'bg-blue-50 text-blue-600 dark:bg-blue-950/35 dark:text-blue-400 border border-blue-200 animate-pulse';
                else statusBadge = 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200';

                return (
                  <div 
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-all flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-white dark:bg-slate-900"
                  >
                    
                    {/* Position and basic patient info */}
                    <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                      <div className="px-2 py-3 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-350 rounded-xl text-center shrink-0 w-12 flex flex-col justify-center items-center">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">POS</span>
                        <span className="text-base font-black mt-0.5 leading-none">
                          {item.position > 0 ? `#${item.position}` : '-'}
                        </span>
                      </div>

                      <div className="min-w-0 space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">{item.patientName}</span>
                          <span className="text-xs text-slate-400">({item.patientAge} Years)</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${statusBadge}`}>
                            {item.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 truncate">
                           Complaints: <span className="font-normal text-slate-650 dark:text-slate-300">{item.symptoms}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-semibold">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded-lg text-slate-500 dark:text-slate-300">
                            🏢 {item.hospital || assignedDoc?.hospital || 'QueueCare General Hospital'}
                          </span>
                          <span className="bg-indigo-50/50 dark:bg-slate-850 px-2 py-1.5 rounded-lg text-indigo-600 dark:text-indigo-400">
                            🩺 Dr: {assignedDoc?.name || 'Unassigned'} ({assignedDoc?.specialty || 'General Practitioner'})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Flow & Dispatch Actions */}
                    <div className="flex items-center flex-wrap gap-3.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 justify-between lg:justify-end">
                      
                      {/* Priority Controls (Waiting patients only) */}
                      {isWaiting && (
                        <div className="flex items-center space-x-1 border border-slate-100 dark:border-slate-800 rounded-lg p-0.5 bg-slate-50/40 dark:bg-slate-850/50">
                          <button
                            onClick={() => handleMoveUp(item.id)}
                            className="p-1 rounded text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-[#4A5FE8] transition-all"
                            title="Elevate Priority (Move Up)"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-[10px] font-extrabold text-slate-400 px-1 uppercase tracking-wider">Order</span>
                          <button
                            onClick={() => handleMoveDown(item.id)}
                            className="p-1 rounded text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-rose-500 transition-all"
                            title="Lower Priority (Move Down)"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Doctor Reassign Dropdown selection */}
                      {!isDone && (
                        <div className="flex items-center space-x-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">TRANSF:</span>
                          <select
                            value={item.doctorId}
                            onChange={(e) => handleReassignDoctor(item.id, e.target.value)}
                            className="px-2 py-1.5 bg-slate-50 dark:bg-slate-800 text-[11px] rounded-lg border-0 focus:ring-2 focus:ring-[#4A5FE8] outline-none cursor-pointer font-bold text-slate-600 dark:text-slate-350"
                          >
                            {doctors.map(d => (
                              <option key={d.id} value={d.id}>
                                {d.name} ({d.specialty[0]}...)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Manual Triage dispatcher */}
                      <div className="flex items-center space-x-2">
                        {isWaiting && (
                          <button
                            onClick={() => {
                              onUpdateQueueStatus(item.id, 'In-Progress');
                              addToast(`Summoned ${item.patientName} directly to desk cabinet!`, "success");
                            }}
                            className="px-3.5 py-1.5 bg-slate-900 border border-transparent dark:bg-blue-600 hover:bg-[#4A5FE8] text-white text-[10px] font-black rounded-lg transition-all"
                          >
                            Summon
                          </button>
                        )}
                        {isTreating && (
                          <button
                            onClick={() => {
                              onUpdateQueueStatus(item.id, 'Done');
                              addToast(`Discharged ${item.patientName}. Session done.`, "success");
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-750 text-white text-[10px] font-black rounded-lg transition-all"
                          >
                            Mark Done
                          </button>
                        )}
                        {isDone && (
                          <span className="text-[9px] font-bold text-slate-400 italic flex items-center space-x-1 px-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Treated</span>
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

      </div>
    </div>
  );
}