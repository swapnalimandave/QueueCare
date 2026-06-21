import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, User, ArrowRight, Activity } from 'lucide-react';
import { UserRole } from '../types';
import { useTheme } from '../ThemeContext';

interface AuthPageProps {
  initialMode: 'login' | 'signup';
  onLoginSuccess: (role: UserRole, personName: string) => void;
  onNavigate: (path: string) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

export default function AuthPage({
  initialMode,
  onLoginSuccess,
  onNavigate,
  addToast
}: AuthPageProps) {
  const { colors, isDark } = useTheme();
  
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Synchronize with parent initial state when navigated directly
  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      addToast("Please fill in all security fields", "warning");
      return;
    }
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      addToast("Please enter a valid email address", "warning");
      return;
    }

    if (password.length < 6) {
      addToast("Security Password must be at least 6 characters.", "warning");
      return;
    }

    if (authMode === 'signup' && !name.trim()) {
      addToast("Please provide your full legal name", "warning");
      return;
    }

    // Capture sign up or sign in name
    const finalName = authMode === 'signup' 
      ? name.trim() 
      : (selectedRole === 'patient' 
          ? 'Swapnali Mandave' 
          : selectedRole === 'doctor' 
            ? 'Dr. Robert Chen' 
            : 'Chief Coordinator Alex');
    
    onLoginSuccess(selectedRole, finalName);
    addToast(
      authMode === 'signup' 
        ? `Account registered! Welcome to QueueCare, ${finalName}` 
        : `Welcome back, ${finalName}! Session initiated.`, 
      'success'
    );
    
    // Auto redirect based on role
    if (selectedRole === 'patient') {
      onNavigate('/patient/dashboard');
    } else if (selectedRole === 'doctor') {
      onNavigate('/doctor/dashboard');
    } else {
      onNavigate('/coordinator/dashboard');
    }
  };

  return (
    <div className={`min-h-[85vh] flex flex-col justify-center items-center px-4 relative overflow-hidden py-12 transition-colors ${colors.bgMain}`}>
      
      {/* Decorative blurred blobs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-pink-300/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Main card viewport */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[460px] bg-white dark:bg-slate-900 rounded-[24px] p-8 shadow-2xl relative border border-white/50 dark:border-slate-800/80 transition-colors"
        id="auth-card-wrapper"
      >
        
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-[#4A5FE8] dark:text-blue-400 text-[10px] font-bold">
            <Shield className="h-3.5 w-3.5" />
            <span>Secure Hospital Hub</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {authMode === 'login' ? 'Welcome Back!' : 'Create Free Account'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            {authMode === 'login' 
              ? 'Enter credentials to retrieve medical treatment lines' 
              : 'Join QueueCare to log appointments in real-time'}
          </p>
        </div>

        {/* Role selector - supports Patient, Doctor and Staff/Coordinator */}
        <div className="mb-6">
          <p className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
            Select Your Hospital Role
          </p>
          
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-[11px] font-bold font-sans">
            <button
              type="button"
              onClick={() => setSelectedRole('patient')}
              className={`text-center py-2.5 rounded-xl transition-all flex flex-col md:flex-row items-center justify-center md:space-x-1 ${
                selectedRole === 'patient'
                  ? 'bg-[#4A5FE8] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              id="auth-role-patient"
            >
              <User className="h-3.5 w-3.5 shrink-0" />
              <span>Patient</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('doctor')}
              className={`text-center py-2.5 rounded-xl transition-all flex flex-col md:flex-row items-center justify-center md:space-x-1 ${
                selectedRole === 'doctor'
                  ? 'bg-[#4A5FE8] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              id="auth-role-doctor"
            >
              <Activity className="h-3.5 w-3.5 shrink-0" />
              <span>Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('coordinator')}
              className={`text-center py-2.5 rounded-xl transition-all flex flex-col md:flex-row items-center justify-center md:space-x-1 ${
                selectedRole === 'coordinator'
                  ? 'bg-[#4A5FE8] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              id="auth-role-coordinator"
            >
              <Shield className="h-3.5 w-3.5 shrink-0" />
              <span>Staff</span>
            </button>
          </div>
        </div>

        {/* Auth form sheet */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {authMode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Full Legal Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 text-slate-400 dark:text-slate-500 h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="e.g. Swapnali Mandave"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl focus:ring-2 focus:ring-[#4A5FE8] dark:focus:ring-[#4A5FE8] focus:border-[#4A5FE8] outline-none text-slate-800 dark:text-white font-semibold transition-colors"
                  required={authMode === 'signup'}
                  id="auth-name-input"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Hospital Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-slate-400 dark:text-slate-500 h-4 w-4" />
              <input 
                type="email" 
                placeholder="e.g. swapnali.mandave@com..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl focus:ring-2 focus:ring-[#4A5FE8] dark:focus:ring-[#4A5FE8] focus:border-[#4A5FE8] outline-none text-slate-800 dark:text-white font-semibold transition-colors"
                required
                id="auth-email-input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Security Password (min 6 chars)
              </label>
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={() => addToast("Security link dispatched to registered email!", "info")}
                  className="text-[10px] text-[#4A5FE8] dark:text-blue-400 font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-slate-400 dark:text-slate-500 h-4 w-4" />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl focus:ring-2 focus:ring-[#4A5FE8] dark:focus:ring-[#4A5FE8] focus:border-[#4A5FE8] outline-none text-slate-800 dark:text-white font-semibold transition-colors"
                required
                id="auth-password-input"
              />
            </div>
          </div>

          {/* Form disclaimer prompt on signup */}
          {authMode === 'signup' && (
            <p className="text-[10px] text-slate-450 dark:text-slate-400 leading-normal font-light">
              By registering, you agree to comply with medical data audits, encrypted queue cookies, and HIPAA storage privacy provisions.
            </p>
          )}

          {/* Pill-shaped secure submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#4A5FE8] hover:bg-opacity-90 text-white font-bold text-xs transition-all shadow-md shadow-indigo-100 dark:shadow-none flex items-center justify-center space-x-2 cursor-pointer"
              id="auth-submit-button"
            >
              <span>{authMode === 'login' ? 'Sign In Securely' : 'Complete Registration'}</span>
              <ArrowRight className="h-4 w-4 md:h-4 md:w-4" />
            </button>
          </div>

        </form>

        {/* Separator toggle link */}
        <div className="mt-6 pt-4 border-t border-indigo-50 dark:border-slate-800 text-center text-xs text-slate-550 dark:text-slate-400">
          {authMode === 'login' ? (
            <p>
              New to our Hospital System?{' '}
              <button 
                onClick={() => setAuthMode('signup')}
                className="text-[#4A5FE8] dark:text-blue-400 font-black hover:underline ml-1"
                id="auth-switch-signup"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already configured a profile?{' '}
              <button 
                onClick={() => setAuthMode('login')}
                className="text-[#4A5FE8] dark:text-blue-400 font-black hover:underline ml-1"
                id="auth-switch-login"
              >
                Sign In Instead
              </button>
            </p>
          )}
        </div>

        {/* Demo Fast Sandbox assist */}
        <div className="mt-4 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 leading-normal text-center font-semibold border border-slate-100 dark:border-slate-800">
          💡 Demo Sandbox: Choose role, fill credentials, and submit to proceed instantly.
        </div>

      </motion.div>
    </div>
  );
}
