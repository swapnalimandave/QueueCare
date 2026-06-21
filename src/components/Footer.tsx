import React from 'react';
import { Mail, Phone, MapPin, Shield, Twitter, Facebook, Linkedin, Heart, HelpCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div 
              onClick={() => onNavigate('/')} 
              className="flex items-center space-x-2 cursor-pointer group transition-transform duration-200 hover:scale-[1.01]"
            >
              <div className="flex items-center space-x-2 text-[#5E72F9] group-hover:text-blue-400 transition-colors">
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
                <circle 
                  cx="102" 
                  cy="24" 
                  r="14" 
                  stroke="currentColor" 
                  strokeWidth="4.5" 
                  fill="none" 
                />
                <circle 
                  cx="102" 
                  cy="24" 
                  r="4.5" 
                  fill="currentColor" 
                />
                </svg>
                <span className="font-extrabold text-[20px] tracking-[0.06em] uppercase text-white transition-colors font-sans">
                  QUEUECARE
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-450 leading-relaxed font-light">
              Designing the future of clinical wait times. Experience seamless digital check-ins, automated AI prediction routing, and stress-free medical appointments.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white transition-all text-slate-450">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white transition-all text-slate-450">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white transition-all text-slate-450">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-blue-400 hover:translate-x-1 transition-all">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/#features')} className="hover:text-blue-400 hover:translate-x-1 transition-all">
                  Feature Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/#how-it-works')} className="hover:text-blue-400 hover:translate-x-1 transition-all">
                  How It Performs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/patient/dashboard')} className="hover:text-blue-400 hover:translate-x-1 transition-all flex items-center space-x-1">
                  <span>My Queue Widget</span>
                  <span className="bg-blue-600/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded">Live</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/patient/book')} className="hover:text-blue-400 hover:translate-x-1 transition-all">
                  Book Appointment
                </button>
              </li>
            </ul>
          </div>

          {/* For Doctors Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
              For Providers
            </h3>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <button onClick={() => onNavigate('/#doctors-section')} className="hover:text-blue-400 hover:translate-x-1 transition-all">
                  Hospital Dashboard Pitch
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/doctor/dashboard')} className="hover:text-blue-400 hover:translate-x-1 transition-all">
                  Doctor Live Panel
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all block">
                  Enterprise Queue API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all block">
                  HIPAA Security Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 hover:translate-x-1 transition-all block">
                  Interactive Calibrator
                </a>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider text-slate-100 uppercase font-bold">
              Contact & Support
            </h3>
            <ul className="space-y-3 text-sm font-light">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <span>100 Innovation Parkway, Suite 400, San Francisco, CA</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="font-semibold text-slate-200">+1 (800) 555-WAIT</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="hover:text-blue-400 transition-colors">support@queuecare.org</span>
              </li>
              <li className="pt-2">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <div className="text-xs">
                    <p className="text-slate-300 font-medium">Need immediate assistance?</p>
                    <p className="text-[10px] text-slate-500">Live chat operates 24/7</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator / Copyright Info */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div className="bg-[#1A1A2E] border border-slate-800 text-slate-400 px-3 py-1 rounded-full text-[11px] font-mono">
            Hospital Queue System <span className="text-[#4A5FE8] font-bold">v2.4.0-stable</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Server Status: <strong className="font-bold text-slate-200">Online</strong></span>
          </div>

          <div>© {currentYear} QueueCare. Dedicated to frictionless clinical flows.</div>
        </div>

      </div>
    </footer>
  );
}
