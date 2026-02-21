import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  theme?: 'light' | 'dark';
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  className = '',
  theme = 'dark'
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside as any);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as any);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-[24px] transition-all focus:outline-none flex items-center justify-between border ${theme === 'light'
          ? 'bg-[#F5F5F5] text-black border-black/5 focus:border-black/20'
          : 'bg-[#080808] text-white border-white/10 focus:border-white/30'
          }`}
        style={{
          fontFamily: 'Boston, sans-serif',
          fontSize: '1rem',
          ...(isOpen && {
            borderColor: theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.3)'
          })
        }}
      >
        <span className="truncate text-left">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 ml-2 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)' }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 rounded-3xl overflow-hidden z-50 shadow-2xl border ${theme === 'light' ? 'bg-white border-black/5' : 'bg-[#1A1C19] border-white/10'
            }`}
          style={{
            maxHeight: '280px',
            overflowY: 'auto',
            animation: 'slideDown 0.2s ease-out',
            boxShadow: theme === 'light' ? '0 20px 60px rgba(0, 0, 0, 0.1)' : '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}
        >
          <style>{`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-8px) scale(0.98);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>

          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className="w-full px-5 py-3.5 text-left transition-all flex items-center justify-between"
              style={{
                fontFamily: 'Boston, sans-serif',
                fontSize: '0.9375rem',
                color: value === option.value
                  ? (theme === 'light' ? '#000000' : '#FFFFFF')
                  : (theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)'),
                backgroundColor: 'transparent',
                borderTop: index === 0 ? 'none' : `1px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'}`,
                fontWeight: value === option.value ? 600 : 400
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = theme === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check className="w-5 h-5 ml-2" style={{ color: theme === 'light' ? '#000000' : '#FFFFFF' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}