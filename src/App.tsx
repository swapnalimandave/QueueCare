import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import LandingPage from './pages/LandingPage';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import DoctorDashboard from './pages/DoctorDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import AuthPage from './pages/AuthPage';
import { Doctor, Appointment, QueueItem, UserRole, ToastMessage } from './types';
import { INITIAL_DOCTORS, INITIAL_APPOINTMENTS, INITIAL_QUEUE } from './mockData';
import { Clock, Shield, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeContext';

export default function App() {
  const { theme, isDark, colors, toggleTheme } = useTheme();
  
  // Custom routing states
  const [currentPath, setCurrentPath] = useState<string>('/');
  
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('qc_isLoggedIn') !== 'false'; // Keep logged in initially as default
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('qc_userRole') as UserRole) || 'patient';
  });
  const [patientName, setPatientName] = useState<string>(() => {
    return localStorage.getItem('qc_patientName') || 'Swapnali Mandave';
  });

  // Core application states
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [queueList, setQueueList] = useState<QueueItem[]>(() => {
    // Attempt load from localStorage to keep state persistent
    const preserved = localStorage.getItem('qc_queue');
    return preserved ? JSON.parse(preserved) : INITIAL_QUEUE;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Track Hash Route syncing
  useEffect(() => {
    const handleHashChange = () => {
      // Decode current hash pathway
      const hash = window.location.hash.slice(1) || '/';
      
      // Support smooth scroll sections
      if (hash.startsWith('/#')) {
        const id = hash.slice(2);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        setCurrentPath('/');
      } else {
        setCurrentPath(hash);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // trigger on initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
  };

  // Persist Queue Changes
  useEffect(() => {
    localStorage.setItem('qc_queue', JSON.stringify(queueList));
  }, [queueList]);

  // Theme state synced via ThemeProvider

  // Helper toast notifier
  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const nextId = 'toast-' + Date.now() + Math.random().toString(36).substr(2, 4);
    const newToast: ToastMessage = { id: nextId, message, type };
    
    setToasts(prev => [...prev, newToast]);

    // Cleanup after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== nextId));
    }, 4000);
  };

  const handleCloseToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Authentication callbacks
  const handleLoginSuccess = (role: UserRole, name: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setPatientName(name);
    localStorage.setItem('qc_isLoggedIn', 'true');
    localStorage.setItem('qc_userRole', role);
    localStorage.setItem('qc_patientName', name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('qc_isLoggedIn', 'false');
    addToast("Logged out successfully. Please sign in to book slots.", "info");
    navigateTo('/');
  };

  const handleSwitchRole = (newRole: UserRole) => {
    setUserRole(newRole);
    localStorage.setItem('qc_userRole', newRole);
    addToast(`Switched view to demo standard ${newRole === 'patient' ? 'Patient' : newRole === 'doctor' ? 'Doctor' : 'Hospital Coordinator'} layout.`, 'info');
    
    if (newRole === 'patient') navigateTo('/patient/dashboard');
    else if (newRole === 'doctor') navigateTo('/doctor/dashboard');
    else if (newRole === 'coordinator') navigateTo('/coordinator/dashboard');
  };

  // State manipulation algorithms
  const handleBookAppointment = (doctorId: string, day: string, time: string, symptoms: string) => {
    const targetDoc = doctors.find(d => d.id === doctorId);
    if (!targetDoc) return;

    // Calculate queue tail position for this specific doctor and hospital
    const waitingPatients = queueList.filter(q => q.status === 'Waiting' && q.doctorId === doctorId && q.hospital === targetDoc.hospital);
    const tailPosition = waitingPatients.reduce((max, cur) => cur.position > max ? cur.position : max, 0) + 1;

    // 1. Append Appointment object
    const newAppt: Appointment = {
      id: 'appt-' + Date.now(),
      doctorId,
      doctorName: targetDoc.name,
      doctorSpecialty: targetDoc.specialty,
      doctorImage: targetDoc.image,
      date: 'Today',
      time,
      status: 'Confirmed',
      queuePos: tailPosition,
      estimatedWaitMinutes: tailPosition * 8
    };

    setAppointments(prev => [newAppt, ...prev]);

    // 2. Insert into live triage line
    const newQueueItem: QueueItem = {
      id: 'q-' + Date.now(),
      patientName: `${patientName} (You)`,
      patientAge: 22,
      timeSlot: time,
      symptoms: symptoms || 'Standard Checkup',
      status: 'Waiting',
      position: tailPosition,
      doctorId,
      hospital: targetDoc.hospital
    };

    setQueueList(prev => [...prev, newQueueItem]);
  };

  const handleCancelAppointment = (apptId: string) => {
    const targetAppt = appointments.find(a => a.id === apptId);
    if (!targetAppt) return;

    // 1. Remove appointment
    setAppointments(prev => prev.filter(a => a.id !== apptId));

    // 2. Filter queue item and re-arrange positions for subsequent waiting entries
    const cancelledPos = targetAppt.queuePos;
    if (cancelledPos) {
      setQueueList(prev => {
        const remaining = prev.filter(item => !item.patientName.includes('You'));
        // Decrement positions for patients that were behind us
        return remaining.map(item => {
          if (item.status === 'Waiting' && item.position > cancelledPos) {
            return { ...item, position: item.position - 1 };
          }
          return item;
        });
      });
      addToast("Appointment and related queue ticket deleted.", "warning");
    } else {
      addToast("Active appointment cancelled.", "warning");
    }
  };

  // Doctor Dashboard Queue State modifications
  const handleUpdateQueueStatus = (id: string, newStatus: 'Waiting' | 'In-Progress' | 'Done') => {
    setQueueList(prev => {
      // Find item being updated
      const target = prev.find(q => q.id === id);
      if (!target) return prev;

      if (newStatus === 'In-Progress') {
        // Mark previous 'In-Progress' as 'Done'
        return prev.map(item => {
          if (item.status === 'In-Progress') {
            return { ...item, status: 'Done', position: 0 };
          }
          if (item.id === id) {
            return { ...item, status: 'In-Progress', position: 0 };
          }
          return item;
        });
      }

      if (newStatus === 'Done') {
        return prev.map(item => {
          if (item.id === id) {
            return { ...item, status: 'Done', position: 0 };
          }
          return item;
        });
      }

      return prev.map(item => {
        if (item.id === id) {
          return { ...item, status: newStatus };
        }
        return item;
      });
    });
  };

  // ADVANCED: Advance Queue Line (Resolves current, calls next, decrements waiting ranks)
  const handleAdvanceQueue = (hospital = 'QueueCare General Hospital', doctorId = 'doc-4') => {
    let didUpdateInProgress = false;

    setQueueList(prev => {
      // 1. Find and mark current 'In-Progress' patient specifically in this hospital/doctor combo as 'Done'
      let updated = prev.map(item => {
        if (item.status === 'In-Progress' && item.hospital === hospital && item.doctorId === doctorId) {
          didUpdateInProgress = true;
          return { ...item, status: 'Done', position: 0 };
        }
        return item;
      });

      // 2. Find next waiting specifically for this hospital/doctor combo
      const waitingList = updated.filter(item => item.status === 'Waiting' && item.hospital === hospital && item.doctorId === doctorId);
      if (waitingList.length === 0) {
        if (didUpdateInProgress) {
          addToast("The last active patient has been treated! The queue is now clear.", "success");
          return updated;
        }
        addToast(`The queue for ${hospital} is empty! No further patients to summon.`, "info");
        return prev;
      }

      const nextUp = waitingList.sort((a, b) => a.position - b.position)[0];

      // 3. Set that patient to 'In-Progress' & shift everyone else in the same hospital/doctor combo forward
      return updated.map(item => {
        if (item.id === nextUp.id) {
          return { ...item, status: 'In-Progress', position: 0 };
        }
        if (item.status === 'Waiting' && item.hospital === hospital && item.doctorId === doctorId && item.position > nextUp.position) {
          return { ...item, position: item.position - 1 };
        }
        if (item.status === 'Waiting' && item.hospital === hospital && item.doctorId === doctorId && item.position === nextUp.position) {
          return { ...item, status: 'In-Progress', position: 0 };
        }
        return item;
      });
    });

    // Also update any matching interactive appointments
    setAppointments(prev => prev.map(appt => {
      if (appt.status === 'Confirmed' && appt.queuePos !== undefined) {
        if (appt.queuePos === 1) {
          addToast("It's your turn! Please enter Cabinet 3.", "success");
          return { ...appt, queuePos: undefined, estimatedWaitMinutes: 0 };
        }
        if (appt.queuePos > 1) {
          return { 
            ...appt, 
            queuePos: appt.queuePos - 1, 
            estimatedWaitMinutes: (appt.queuePos - 1) * 8 
          };
        }
      }
      return appt;
    }));
  };

  const handleResetQueue = () => {
    setQueueList(INITIAL_QUEUE);
    setAppointments(INITIAL_APPOINTMENTS);
    localStorage.removeItem('qc_queue');
  };

  const handleAddPatientToQueue = (name: string, symptoms: string, hospital = 'QueueCare General Hospital', doctorId = 'doc-4') => {
    const queueForHospitalAndDoctor = queueList.filter(q => q.hospital === hospital && q.doctorId === doctorId);
    const waitingPatients = queueForHospitalAndDoctor.filter(q => q.status === 'Waiting');
    const tailPosition = waitingPatients.reduce((max, cur) => cur.position > max ? cur.position : max, 0) + 1;

    // Get approximate time based on tail
    const nextHour = 9 + Math.floor(tailPosition / 2);
    const mins = (tailPosition % 2 === 0) ? '00' : '30';
    const marker = nextHour >= 12 ? 'PM' : 'AM';
    const computedHour = nextHour > 12 ? nextHour - 12 : nextHour;
    
    const newQueueItem: QueueItem = {
      id: 'q-' + Date.now() + Math.random().toString(36).substr(2, 4),
      patientName: name,
      patientAge: Math.floor(Math.random() * 40) + 20,
      timeSlot: `${computedHour}:${mins} ${marker}`,
      symptoms,
      status: 'Waiting',
      position: tailPosition,
      hospital,
      doctorId
    };

    setQueueList(prev => [...prev, newQueueItem]);
  };

  // Find user's active queue position for the sticky bottom bar
  const userQueueElement = queueList.find(q => q.patientName.toLowerCase().includes(patientName.toLowerCase()) || q.patientName.includes('You'));
  const userActiveWaiting = userQueueElement && userQueueElement.status === 'Waiting';
  const stickyQueuePos = userQueueElement?.position || 0;
  const stickyEstMinutes = stickyQueuePos * 8;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${colors.bgMain}`} id="applet-viewport-root">
      
      {/* Toast Overlays */}
      <Toast toasts={toasts} onCloseToast={handleCloseToast} />

      {/* Common Navbar */}
      <Navbar 
        currentPath={currentPath}
        onNavigate={navigateTo}
        role={userRole}
        onSwitchRole={handleSwitchRole}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        patientName={patientName}
      />

      {/* Main Page Routing Switcher */}
      <main className="flex-grow">
        {currentPath === '/' && (
          <LandingPage 
            onNavigate={navigateTo}
            isLoggedIn={isLoggedIn}
            onQuickBook={() => navigateTo('/patient/book')}
            onMockJoinQueue={() => {
              handleBookAppointment('doc-4', 'Monday', '10:30 AM', 'Throat Irritation');
              addToast("Joined General Medicine Live Queue! Redirected to Monitor.", "success");
              navigateTo('/patient/dashboard');
            }}
          />
        )}

        {currentPath === '/patient/dashboard' && (
          <PatientDashboard 
            appointments={appointments}
            queueList={queueList}
            onNavigate={navigateTo}
            onCancelAppointment={handleCancelAppointment}
            patientName={patientName}
            addToast={addToast}
          />
        )}

        {currentPath === '/patient/book' && (
          <BookAppointment 
            doctors={doctors}
            appointments={appointments}
            onBookAppointment={handleBookAppointment}
            onNavigate={navigateTo}
            addToast={addToast}
          />
        )}

        {currentPath === '/doctor/dashboard' && (
          <DoctorDashboard 
            queueList={queueList}
            onUpdateQueueStatus={handleUpdateQueueStatus}
            onAdvanceQueue={handleAdvanceQueue}
            onResetQueue={handleResetQueue}
            onAddPatientToQueue={handleAddPatientToQueue}
            addToast={addToast}
          />
        )}

        {currentPath === '/coordinator/dashboard' && (
          <CoordinatorDashboard 
            queueList={queueList}
            doctors={doctors}
            appointments={appointments}
            onUpdateQueueList={setQueueList}
            onUpdateQueueStatus={handleUpdateQueueStatus}
            onAddPatientToQueue={handleAddPatientToQueue}
            addToast={addToast}
          />
        )}

        {currentPath === '/login' && (
          <AuthPage 
            initialMode="login"
            onLoginSuccess={handleLoginSuccess}
            onNavigate={navigateTo}
            addToast={addToast}
          />
        )}

        {currentPath === '/signup' && (
          <AuthPage 
            initialMode="signup"
            onLoginSuccess={handleLoginSuccess}
            onNavigate={navigateTo}
            addToast={addToast}
          />
        )}
      </main>

      {/* Responsive Sticky bottom queue progress bar */}
      {isLoggedIn && userRole === 'patient' && userActiveWaiting && currentPath !== '/patient/dashboard' && (
        <div 
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-40 max-w-sm bg-slate-900 border border-slate-700/80 rounded-[18px] p-4 text-white shadow-xl animate-bounce pointer-events-auto"
          style={{ animationDuration: '3s' }}
          id="sticky-queue-bar"
        >
          <div className="flex items-center justify-between space-x-3">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="p-2 bg-[#4A5FE8] rounded-xl text-white shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs tracking-tight">Swapnali Mandave</h5>
                <p className="text-[10px] text-slate-350 font-normal truncate">
                  Live Queue Pos: <strong className="text-blue-400">#{stickyQueuePos}</strong> | Est. Wait: <strong className="text-yellow-400">{stickyEstMinutes}m</strong>
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigateTo('/patient/dashboard')}
              className="text-[10px] bg-slate-800 hover:bg-slate-750 text-[#E4E8F7] font-black px-3 py-1.5 rounded-lg shrink-0 flex items-center space-x-0.5"
            >
              <span>Dashboard</span>
              <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* Common Footer */}
      <Footer onNavigate={navigateTo} />

    </div>
  );
}
