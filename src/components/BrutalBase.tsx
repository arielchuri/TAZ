import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Info, Minus, Plus, Maximize2, Minimize2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  hint?: string;
  accentColor?: string;
  badge?: React.ReactNode;
  headerActions?: React.ReactNode;
  isShaded?: boolean;
  onToggleShade?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  noBodyPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  hint,
  badge,
  headerActions,
  isShaded = false,
  onToggleShade,
  isExpanded = false,
  onToggleExpand,
  noBodyPadding = false,
  children,
  className,
  accentColor = "bg-[#1A66A6]",
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-[#FFFFFF] border border-[#222D2C] flex flex-col relative transition-all duration-150 overflow-hidden",
        isExpanded ? "fixed inset-2 z-50 shadow-2xl h-[calc(100vh-16px)]" : "",
        isShaded ? "h-auto shrink-0" : "",
        className
      )}
      style={{
        borderRadius: 0,
        boxShadow: isExpanded ? "4px 4px 0px 0px rgba(0,0,0,0.3)" : "1px 1px 1px 0 rgba(128, 128, 128, 0.25)",
      }}
      {...props}
    >
      {title && (
        <div
          className={cn(
            "flex justify-between items-center px-3 py-1.5 border-b border-[#222D2C] text-white font-mono shrink-0 select-none h-[30px]",
            accentColor
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-white font-mono truncate leading-none m-0">
              {title}
            </h2>
            {badge}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {headerActions}

            {hint && (
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="w-5 h-5 flex items-center justify-center text-white/80 hover:text-white transition-colors border-none bg-transparent cursor-pointer p-0">
                    <Info size={13} />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="w-64 bg-[#EFECE6] border border-[#222D2C] p-2.5 z-50 animate-in fade-in zoom-in duration-150"
                    style={{
                      borderRadius: 0,
                      boxShadow: "1px 1px 1px 0 rgba(128, 128, 128, 0.25)",
                    }}
                    sideOffset={4}
                  >
                    <p className="text-[10px] font-semibold uppercase leading-normal text-[#222D2C] font-mono m-0">
                      {hint}
                    </p>
                    <Popover.Arrow className="fill-[#222D2C]" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            )}

            {/* Shade Button (Reduce to Title Bar) */}
            {onToggleShade && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleShade();
                }}
                className="w-5 h-5 bg-white/10 hover:bg-white/30 text-white border border-white/40 flex items-center justify-center cursor-pointer p-0 transition-colors"
                title={isShaded ? "Unshade Window" : "Shade to Title Bar"}
                style={{ borderRadius: 0 }}
              >
                {isShaded ? <Plus size={11} /> : <Minus size={11} />}
              </button>
            )}

            {/* Expand Button (Full Screen) */}
            {onToggleExpand && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand();
                }}
                className="w-5 h-5 bg-white/10 hover:bg-white/30 text-white border border-white/40 flex items-center justify-center cursor-pointer p-0 transition-colors"
                title={isExpanded ? "Restore Window" : "Expand to Full Page"}
                style={{ borderRadius: 0 }}
              >
                {isExpanded ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
              </button>
            )}
          </div>
        </div>
      )}

      {!isShaded && (
        <div className={cn("flex-1 flex flex-col min-h-0", noBodyPadding ? "p-0" : "p-2.5 gap-2")}>
          {children}
        </div>
      )}
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
    <div className="flex items-center gap-2 p-1.5 bg-[#EFECE6] border border-[#222D2C] hover:border-[#1A66A6] cursor-pointer transition-colors">
      <div className="p-1 bg-[#1A66A6] text-white flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono font-bold text-[11px] truncate leading-normal text-[#222D2C]">
          {name}
        </div>
        <div className="font-mono text-[9px] text-[#5B6360] leading-normal">{size}</div>
      </div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "outline" | "yellow" | "blue" | "green" | "ghost" | "secondary";
  size?: "xs" | "sm" | "md" | "lg";
  isRound?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "xs",
  isRound = false,
  className,
  children,
  ...props
}) => {
  const variants = {
    primary: "bg-[#1A66A6] text-[#FFFFFF] border-none hover:bg-[#145082]",
    secondary: "bg-transparent text-[#1A66A6] border border-[#1A66A6] hover:bg-[#1A66A6]/10",
    danger: "bg-[#D35B50] text-white border-none hover:bg-[#b84238]",
    outline: "bg-transparent text-[#222D2C] border border-[#222D2C] hover:bg-[#DFDDD7]",
    yellow: "bg-[#F4D35A] text-[#222D2C] border border-[#222D2C] hover:bg-[#ebd052]",
    blue: "bg-[#1A66A6] text-white border-none hover:bg-[#145082]",
    green: "bg-[#54C93F] text-white border-none hover:bg-[#43a830]",
    ghost: "bg-transparent text-[#222D2C] border-none hover:bg-[#DFDDD7]/50",
  };

  const sizeStyles = {
    xs: "px-2 py-0.5 text-[10px] gap-1 h-[24px]",
    sm: "px-2.5 py-1 text-[11px] gap-1.5 h-[26px]",
    md: "px-3.5 py-1.5 text-xs gap-2 h-[30px]",
    lg: "px-4.5 py-2 text-xs gap-2.5 h-[36px]",
  };

  return (
    <button
      className={cn(
        "font-bold uppercase tracking-wider inline-flex items-center justify-center transition-colors cursor-pointer select-none font-mono leading-normal",
        isRound ? "rounded-none aspect-square p-1 flex items-center justify-center" : sizeStyles[size],
        variants[variant],
        className
      )}
      style={{
        borderRadius: 0,
        boxShadow: "none",
      }}
      {...props}
    >
      {children}
    </button>
  );
};
