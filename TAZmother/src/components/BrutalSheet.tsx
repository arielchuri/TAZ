import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
          {/* Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l-8 border-black z-50 p-8 shadow-[-10px_0_0_0_rgba(0,0,0,1)]"
          >
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter">{title}</h2>
              <button 
                onClick={onClose}
                className="p-2 border-4 border-black hover:bg-red-500 hover:text-white transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <X size={24} />
              </button>
            </div>
            <div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
