import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onCloseToast: (id: string) => void;
}

export default function Toast({ toasts, onCloseToast }: ToastProps) {
  return (
    <div className="fixed top-20 right-4 z-[9999] max-w-sm w-full space-y-2 pointer-events-none" id="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => {
          let icon = <Info className="h-5 w-5 text-blue-500 shrink-0" />;
          let bgStyle = 'bg-white border-blue-100 dark:bg-slate-900 dark:border-blue-950';
          
          if (toast.type === 'success') {
            icon = <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
            bgStyle = 'bg-white border-emerald-100 dark:bg-slate-900 dark:border-emerald-950';
          } else if (toast.type === 'warning') {
            icon = <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />;
            bgStyle = 'bg-white border-amber-100 dark:bg-slate-900 dark:border-amber-950';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`p-4 rounded-2xl shadow-lg border flex items-start space-x-3 pointer-events-auto relative ${bgStyle}`}
              id={`toast-${toast.id}`}
            >
              {icon}
              <div className="flex-1 text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-100 italic">QueueCare System Notice</p>
                <p className="font-bold text-[#1A1A2E] dark:text-slate-200 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => onCloseToast(toast.id)}
                className="text-slate-400 hover:text-slate-650 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 self-start"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
