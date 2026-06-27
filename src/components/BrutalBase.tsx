import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  hint?: string;
  accentColor?: string;
}

export const Card: React.FC<CardProps> = ({ title, hint, children, className, accentColor = "bg-black", ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white border-4 border-black shadow-brutal p-6 flex flex-col gap-4 text-left relative",
        className
      )}
      {...props}
    >
      {title && (
        <div className={cn("flex justify-between items-center border-b-4 border-black -mx-6 -mt-6 p-4 text-white", accentColor)}>
          <h2 className="text-2xl font-black uppercase tracking-tighter">{title}</h2>
          {hint && (
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="p-1 hover:bg-white hover:text-black transition-colors border-2 border-transparent hover:border-black">
                  <Info size={20} />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content 
                  className="w-64 bg-white border-4 border-black p-4 shadow-brutal-lg z-50 animate-in fade-in zoom-in duration-200"
                  sideOffset={5}
                >
                  <p className="text-sm font-bold uppercase leading-tight text-black">{hint}</p>
                  <Popover.Arrow className="fill-black" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

interface FileItemProps {
  name: string;
  size: string;
  icon: React.ReactNode;
}

export const FileItem: React.FC<FileItemProps> = ({ name, size, icon }) => {
  return (
    <div className="flex items-center gap-3 p-2 border-2 border-black hover:bg-gray-100 cursor-pointer transition-colors">
      <div className="p-1.5 bg-black text-white border-2 border-black">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-black text-[10px] uppercase truncate leading-tight">{name}</div>
        <div className="text-[8px] font-bold opacity-60 uppercase">{size}</div>
      </div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'outline' | 'yellow' | 'blue' | 'green' | 'ghost';
  isRound?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', isRound = false, className, children, ...props }) => {
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "bg-white text-black hover:bg-gray-100",
    yellow: "bg-yellow-400 text-black hover:bg-yellow-500",
    blue: "bg-blue-400 text-black hover:bg-blue-500",
    green: "bg-green-400 text-black hover:bg-green-500",
    ghost: "bg-transparent border-transparent shadow-none hover:bg-gray-100",
  };

  return (
    <button
      className={cn(
        "border-4 border-black px-6 py-3 font-bold uppercase tracking-widest transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-brutal",
        isRound ? "rounded-full aspect-square p-0 flex items-center justify-center" : "",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
