import React, { useState } from 'react';
import { Sun, Moon, Sparkles, LogOut, Menu, X } from 'lucide-react';
import { UserRole } from '../types';
import { useTheme } from '../ThemeContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  role: UserRole;
  onSwitchRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  patientName: string;
}

export default function Navbar({
  currentPath,
  onNavigate,
  role,
  onSwitchRole,
  isLoggedIn,
  onLogout,
  patientName
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, isDark, colors, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'For Doctors', path: '/#doctors-section' },
    { name: 'Contact', path: '/#contact' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    onNavigate('/');
  };

  const navbarBg = isDark ? 'bg-[#121824]/80 text-slate-100 border-slate-800/80' : 'bg-white/80 text-slate-800 border-slate-200/60';

  return (
    <nav className={`sticky top-0 z-50 w-full transition-colors border-b backdrop-blur-md shadow-sm ${navbarBg}`}>
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Left: Logo */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 cursor-pointer group transition-transform duration-200 hover:scale-[1.02] shrink-0"
            id="nav-logo"
          >
            <div className="flex items-center gap-2 text-[#223984] dark:text-[#5E72F9]">
              <svg
                className="h-8 w-auto transition-colors"
                viewBox="0 0 124 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="QueueCare Logo Icon"
              >
                <path
                  d="M 6 24 H 26 L 34 8 L 44 40 L 52 2 L 60 46 L 68 24 H 88"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="102" cy="24" r="14" stroke="currentColor" strokeWidth="4.5" fill="none" />
                <circle cx="102" cy="24" r="4.5" fill="currentColor" />
              </svg>
              <span className="font-extrabold text-[20px] tracking-[0.06em] uppercase text-[#1F2C6F] dark:text-slate-100 transition-colors font-sans whitespace-nowrap">
                QUEUECARE
              </span>
            </div>
          </div>

          {/* Center: Nav links — only on 2xl+ where there's guaranteed space */}
          <div className="hidden 2xl:flex items-center gap-1 flex-1 justify-center min-w-0 overflow-hidden">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.path)}
                className={`px-2.5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  currentPath === link.path
                    ? 'text-[#4A5FE8] dark:text-blue-400 font-bold'
                    : `${colors.textSecondary} hover:text-[#4A5FE8] dark:hover:text-blue-400`
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right side: role switcher, theme, profile */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Role switcher + Dashboard — visible from lg up */}
            <div className="hidden lg:flex items-center gap-2 border-l border-slate-200/80 dark:border-slate-700/80 pl-4 mr-2">
              <div className="flex items-center gap-1 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-950 p-1 shadow-sm">
                <button
                  onClick={() => onSwitchRole('patient')}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    role === 'patient'
                      ? 'bg-[#4A5FE8] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#1A1A2E] dark:hover:text-white'
                  }`}
                >
                  Patient
                </button>
                <button
                  onClick={() => onSwitchRole('doctor')}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    role === 'doctor'
                      ? 'bg-[#4A5FE8] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#1A1A2E] dark:hover:text-white'
                  }`}
                >
                  Doctor
                </button>
                <button
                  onClick={() => onSwitchRole('coordinator')}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    role === 'coordinator'
                      ? 'bg-[#4A5FE8] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#1A1A2E] dark:hover:text-white'
                  }`}
                >
                  Coordinator
                </button>
              </div>
              <button
                onClick={() => handleLinkClick(role === 'patient' ? '/patient/dashboard' : role === 'doctor' ? '/doctor/dashboard' : '/coordinator/dashboard')}
                className="rounded-full bg-[#4A5FE8] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors whitespace-nowrap"
              >
                Dashboard
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all shrink-0 ${isDark ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Toggle Theme"
              id="theme-toggle-button"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Profile / Auth buttons — desktop (lg+) */}
            {isLoggedIn ? (
              <div className="hidden lg:flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs uppercase shrink-0">
                    {role === 'patient' ? patientName[0] : role === 'doctor' ? 'Dr' : 'Co'}
                  </div>
                  <div className="min-w-0 max-w-[110px]">
                    <p className="text-xs font-semibold truncate text-slate-900 dark:text-slate-100">
                      {role === 'patient' ? patientName : role === 'doctor' ? 'Dr. Robert Chen' : 'Coordinator'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-full text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all shrink-0"
                  title="Logout"
                  id="logout-button"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => handleLinkClick('/login')}
                  className={`px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${colors.textSecondary} hover:text-blue-600 dark:hover:text-blue-400`}
                  id="navbar-login-btn"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleLinkClick('/signup')}
                  className="px-4 py-2 text-sm font-semibold rounded-full bg-slate-900 text-white dark:bg-blue-600 hover:bg-slate-800 transition-all shadow-sm whitespace-nowrap"
                  id="navbar-signup-btn"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile controls — below 2xl */}
            <div className="flex items-center gap-2 2xl:hidden">
              <button
                onClick={onLogout}
                className={`p-2 rounded-full transition-all ${isDark ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
                title="Profile"
                id="mobile-profile-button"
              >
                <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm uppercase">
                  {role === 'patient' ? patientName[0] : role === 'doctor' ? 'Dr' : 'Co'}
                </div>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${isDark ? 'text-slate-200 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900'}`}
                id="mobile-menu-toggle-button"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel — triggers below 2xl */}
      {mobileMenuOpen && (
        <div className={`2xl:hidden border-b ${isDark ? 'border-slate-800 bg-[#0C101B]/95 text-slate-150' : 'border-slate-200 bg-white/95 text-slate-800'} shadow-lg max-h-[85vh] overflow-y-auto`}>
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.path)}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                  currentPath === link.path
                    ? 'bg-blue-50 text-blue-600 dark:bg-slate-850 dark:text-blue-400 font-bold'
                    : `${colors.textSecondary} hover:bg-slate-50 dark:hover:bg-slate-850`
                }`}
              >
                {link.name}
              </button>
            ))}

            <div className={`pt-4 pb-2 border-t mt-4 px-4 space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              {isLoggedIn ? (
                <>
                  <div className="flex flex-col space-y-2.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">DEMO VIEWS</span>
                    <div className={`flex p-1 rounded-full text-xs font-semibold w-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <button
                        onClick={() => onSwitchRole('patient')}
                        className={`flex-1 text-center py-1.5 rounded-full transition-all ${
                          role === 'patient' ? 'bg-blue-600 text-white shadow-sm' : `${colors.textSecondary}`
                        }`}
                      >
                        Patient
                      </button>
                      <button
                        onClick={() => onSwitchRole('doctor')}
                        className={`flex-1 text-center py-1.5 rounded-full transition-all ${
                          role === 'doctor' ? 'bg-blue-600 text-white shadow-sm' : `${colors.textSecondary}`
                        }`}
                      >
                        Doctor
                      </button>
                      <button
                        onClick={() => onSwitchRole('coordinator')}
                        className={`flex-1 text-center py-1.5 rounded-full transition-all ${
                          role === 'coordinator' ? 'bg-blue-600 text-white shadow-sm' : `${colors.textSecondary}`
                        }`}
                      >
                        Coord.
                      </button>
                    </div>

                    <button
                      onClick={() => handleLinkClick(role === 'patient' ? '/patient/dashboard' : role === 'doctor' ? '/doctor/dashboard' : '/coordinator/dashboard')}
                      className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-semibold bg-blue-50 text-blue-600 dark:bg-slate-850 dark:text-blue-400 rounded-xl"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Go to Dashboard</span>
                    </button>
                  </div>

                  <div className={`h-px my-2 ${isDark ? 'bg-slate-800' : 'bg-slate-150'}`} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold uppercase">
                        {role === 'patient' ? patientName[0] : 'Dr'}
                      </div>
                      <span className={`text-sm font-semibold ${colors.textPrimary}`}>
                        {role === 'patient' ? patientName : 'Dr. Robert Chen'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleLinkClick('/login')}
                    className={`w-full text-center py-2.5 text-sm font-semibold rounded-xl border ${colors.border} ${colors.textSecondary}`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleLinkClick('/signup')}
                    className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-slate-900 text-white dark:bg-blue-600"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}