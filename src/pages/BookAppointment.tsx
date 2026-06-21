import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, SlidersHorizontal, Star, Calendar, Clock, 
  MapPin, Stethoscope, ChevronRight, CheckCircle2, AlertTriangle, User, MessageCircleCode
} from 'lucide-react';
import { Doctor, Appointment } from '../types';
import { INITIAL_DOCTORS } from '../mockData';
import { useTheme } from '../ThemeContext';

interface BookAppointmentProps {
  doctors: Doctor[];
  appointments: Appointment[];
  onBookAppointment: (doctorId: string, day: string, time: string, symptoms: string) => void;
  onNavigate: (path: string) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

export default function BookAppointment({
  doctors,
  appointments,
  onBookAppointment,
  onNavigate,
  addToast
}: BookAppointmentProps) {
  const { colors, isDark } = useTheme();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(doctors[0]?.id || null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [symptomsInput, setSymptomsInput] = useState('');

  // Extract all unique specialties for the dropdown
  const uniqueSpecialties = ['All', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  // Filter doctors based on search & specialty dropdown selection
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Currently inspected doctor
  const inspectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  // If the inspected doctor doesn't have availability on the selectedDay, fallback to his/her first available day
  const availableDays = inspectedDoctor ? Object.keys(inspectedDoctor.availability) : [];
  const activeDay = inspectedDoctor && availableDays.includes(selectedDay) 
    ? selectedDay 
    : (availableDays[0] || 'Monday');

  const handleSelectDoctor = (id: string) => {
    setSelectedDoctorId(id);
    setSelectedTimeSlot(null);
    // Auto focus first available day for this doctor
    const doc = doctors.find(d => d.id === id);
    if (doc) {
      const days = Object.keys(doc.availability);
      if (days.length > 0) {
        setSelectedDay(days[0]);
      }
    }
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedTimeSlot) {
      addToast("Please select a doctor and open timeslot slot", "warning");
      return;
    }

    onBookAppointment(selectedDoctorId, activeDay, selectedTimeSlot, symptomsInput);
    addToast("Appointment Confirmed!", "success");
    onNavigate('/patient/dashboard');
  };

  return (
    <div className={`min-h-screen py-8 ${colors.bgMain}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Headers */}
        <div className="mb-8 text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-2xl md:text-3.5xl font-black tracking-tight" id="booking-title">
            Book An Appointment
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Specify clinical subspecialists, evaluate open slots, and secure instant queue tickets.
          </p>
        </div>

        {/* Filter bar search and drop selectors */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-12 gap-4 border border-slate-100 dark:border-slate-800">
          
          <div className="md:col-span-7 relative flex items-center">
            <Search className="absolute left-3 h-5 w-5 text-slate-450 shrink-0" />
            <input 
              type="text" 
              placeholder="Search by name, clinic specialty, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 text-xs border-0 rounded-xl focus:ring-2 focus:ring-[#4A5FE8] outline-none"
              id="doctor-search-input"
            />
          </div>

          <div className="md:col-span-5 flex items-center space-x-3">
            <div className="w-full relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border-0 rounded-xl text-xs focus:ring-2 focus:ring-[#4A5FE8] cursor-pointer appearance-none outline-none font-semibold text-slate-600 dark:text-slate-300"
                id="specialization-filter-dropdown"
              >
                {uniqueSpecialties.map(spec => (
                  <option key={spec} value={spec}>
                    Category: {spec === 'All' ? 'All Specialties' : spec}
                  </option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedSpecialty('All'); }}
              className="px-4 py-2.5 text-xs font-bold text-[#4A5FE8] dark:text-blue-400 hover:bg-[#4A5FE8]/5 dark:hover:bg-slate-800 rounded-xl border border-dashed border-[#4A5FE8]/20"
            >
              Reset
            </button>
          </div>

        </div>

        {/* Binary splitting Panel: Left Doctor List, Right Active Slot Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Doctor Selection Grid column */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="flex justify-between items-center px-1">
              <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-500">
                Available Doctors ({filteredDoctors.length})
              </h2>
              <span className="text-xs text-slate-450">Select to examine slots</span>
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-450 space-y-3">
                <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
                <p className="text-xs font-semibold">No clinicians match your filters.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedSpecialty('All'); }}
                  className="text-xs text-[#4A5FE8] underline"
                >
                  Clear search fields
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {filteredDoctors.map((doc) => {
                  const isSelected = selectedDoctorId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => handleSelectDoctor(doc.id)}
                      className={`p-4 rounded-[20px] transition-all cursor-pointer border flex items-start justify-between space-x-3.5 group ${
                        isSelected 
                          ? 'bg-white dark:bg-slate-900 border-[#4A5FE8] shadow-md dark:shadow-none' 
                          : 'bg-white/80 hover:bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                      }`}
                      id={`doctor-card-${doc.id}`}
                    >
                      <img 
                        className="h-14 w-14 rounded-full object-cover shrink-0 border border-slate-100 bg-slate-100"
                        src={doc.image} 
                        alt={doc.name} 
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-black text-sm text-[#1A1A2E] dark:text-white group-hover:text-[#4A5FE8] transition-colors truncate">
                          {doc.name}
                        </h3>
                        <p className="text-[11px] text-[#4A5FE8] dark:text-blue-400 font-bold uppercase tracking-wider">
                          {doc.specialty}
                        </p>
                        
                        <div className="flex items-center space-x-2 text-xs text-slate-500 pt-0.5">
                          <span className="flex items-center text-amber-400 font-bold">
                            <Star className="h-3 w-3 fill-amber-400 mr-0.5" />
                            <span>{doc.rating}</span>
                          </span>
                          <span className="text-[10px] text-slate-400">({doc.reviewsCount} reviews)</span>
                          <span className="text-slate-350">|</span>
                          <span className="text-[10px] text-slate-400">{doc.experience}y exp</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                        <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-[#4A5FE8] dark:text-indigo-400 px-2 py-0.5 rounded font-black">
                          {Object.keys(doc.availability).length} active days
                        </span>
                        
                        <div className="flex items-center space-x-0.5 text-[#4A5FE8] font-black text-xs group-hover:translate-x-1 transition-transform">
                          <span>Slots</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive weekly calendar Slot selection column */}
          <div className="lg:col-span-7">
            {inspectedDoctor ? (
              <div 
                className="bg-white dark:bg-slate-900 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6"
                id="interactive-calendar-panel"
              >
                
                {/* Doctor quick overview heading inside panel */}
                <div className="flex items-center space-x-4 pb-4 border-b border-indigo-50 dark:border-slate-800">
                  <img 
                    className="h-12 w-12 rounded-full object-cover bg-slate-200 border" 
                    src={inspectedDoctor.image} 
                    alt={inspectedDoctor.name} 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {inspectedDoctor.name}
                    </h3>
                    <p className="text-xs text-slate-450 leading-relaxed font-light">
                      {inspectedDoctor.specialty} Specialist • {inspectedDoctor.hospital}
                    </p>
                  </div>
                </div>

                {/* Day selector carousel */}
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Select Consultation Day
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(inspectedDoctor.availability).map((day) => {
                      const isActive = activeDay === day;
                      const dayMeta = inspectedDoctor.availability[day];
                      return (
                        <button
                          key={day}
                          onClick={() => { setSelectedDay(day); setSelectedTimeSlot(null); }}
                          type="button"
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-[#1A1A2E] text-white shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-350 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>{day}</span>
                          <span className="block text-[9px] font-normal text-slate-400 mt-0.5">
                            {dayMeta.slots.filter(s => s.status === 'free').length} slots free
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color-coded Timeslot grid widget */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Timeslots Selection Map ({activeDay})
                    </p>
                    
                    {/* legend labels */}
                    <div className="flex items-center space-x-3.5 text-[10px] font-semibold">
                      <span className="flex items-center text-slate-500">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1" />
                        Free
                      </span>
                      <span className="flex items-center text-slate-500">
                        <span className="h-2 w-2 rounded-full bg-slate-300 mr-1" />
                        Booked
                      </span>
                      <span className="flex items-center text-slate-500">
                        <span className="h-2 w-2 rounded-full bg-rose-500 mr-1" />
                        Full
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {inspectedDoctor.availability[activeDay]?.slots.map((slot, index) => {
                      const isSelected = selectedTimeSlot === slot.time;
                      const isFree = slot.status === 'free';
                      const isBooked = slot.status === 'booked';
                      const isFull = slot.status === 'full';

                      let badgeClass = '';
                      if (isFree) {
                        badgeClass = isSelected
                          ? 'bg-[#4A5FE8] text-white border-transparent'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-950/50';
                      } else if (isBooked) {
                        badgeClass = 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-100 lines-through dark:bg-slate-850 dark:text-slate-650';
                      } else if (isFull) {
                        badgeClass = 'bg-rose-50 text-rose-500 cursor-not-allowed border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-950/30';
                      }

                      return (
                        <button
                          key={index}
                          type="button"
                          disabled={!isFree}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`rounded-xl py-3 px-2 text-center text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${badgeClass}`}
                          id={`time-slot-${activeDay}-${index}`}
                        >
                          <Clock className={`h-3.5 w-3.5 ${isBooked ? 'text-slate-350' : ''}`} />
                          <span className="font-mono text-[11px]">{slot.time}</span>
                          <span className="text-[9px] font-normal uppercase tracking-wider">
                            {isFree ? 'Available' : isBooked ? 'Booked' : 'Full'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Confirm details & medical symptoms input */}
                <form onSubmit={handleCreateReservation} className="space-y-4 pt-4 border-t border-indigo-50 dark:border-slate-800">
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                      Chief Symptoms & Medical Mandates (Optional)
                    </label>
                    <textarea
                      placeholder="e.g. Chest tightness for 2 days, seasonal cough, prescription renewal need..."
                      value={symptomsInput}
                      onChange={(e) => setSymptomsInput(e.target.value)}
                      className="w-full text-xs p-3 border-0 bg-slate-50 dark:bg-slate-850 rounded-xl focus:ring-2 focus:ring-[#4A5FE8] outline-none"
                      rows={3}
                      id="symptoms-input-field"
                    />
                  </div>

                  {/* Summary of reserved choice */}
                  {selectedTimeSlot && (
                    <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-3 text-xs border border-indigo-100/50 text-[#1A1A2E] dark:text-slate-300 space-y-1.5 animate-fadeIn">
                      <p className="font-semibold text-slate-600 dark:text-slate-400">Reservation Summary Check:</p>
                      <div className="grid grid-cols-2 gap-4">
                        <p>🧑‍⚕️ Clinician: <strong className="font-bold">{inspectedDoctor.name}</strong></p>
                        <p>📁 Department: <strong className="font-bold text-[#4A5FE8]">{inspectedDoctor.specialty}</strong></p>
                        <p>📆 Day/Slot: <strong className="font-bold">{activeDay}</strong></p>
                        <p>⏰ Timing: <strong className="font-bold">{selectedTimeSlot}</strong></p>
                      </div>
                    </div>
                  )}

                  {/* Submit buttons */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!selectedTimeSlot}
                      className={`w-full py-3.5 rounded-full text-xs font-bold text-white transition-all shadow-md ${
                        selectedTimeSlot
                          ? 'bg-[#4A5FE8] hover:bg-indigo-600 cursor-pointer shadow-indigo-100'
                          : 'bg-slate-300 cursor-not-allowed shadow-none dark:bg-slate-800 dark:text-slate-500'
                      }`}
                      id="confirm-booking-submit-btn"
                    >
                      {selectedTimeSlot 
                        ? `Confirm Secure Reservation at ${selectedTimeSlot}` 
                        : "Select a free timeslot from map to continue"}
                    </button>
                    
                    <p className="text-[10px] text-center text-slate-400 mt-2">
                      🔒 Confirmed slots immediately occupy real-time medical queue positions.
                    </p>
                  </div>

                </form>

              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-[28px] p-12 text-center text-slate-400 border border-slate-100 space-y-3">
                <AlertTriangle className="h-12 w-12 mx-auto text-slate-300" />
                <p className="font-semibold">No Doctors Available at all.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
