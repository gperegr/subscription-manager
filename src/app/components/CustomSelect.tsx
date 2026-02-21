import { useState, useRef, useEffect } from 'react';
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
}

export function CustomSelect({ options, value, onChange, placeholder, className = '' }: CustomSelectProps) {
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
        className="w-full px-4 py-3 rounded-2xl text-white border border-white/10 transition-all focus:border-white/30 focus:outline-none flex items-center justify-between"
        style={{ 
          backgroundColor: '#080808', 
          fontFamily: 'Inter, sans-serif', 
          fontSize: '1rem',
          ...(isOpen && { borderColor: 'rgba(255, 255, 255, 0.3)' })
        }}
      >
        <span className="truncate text-left">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-5 h-5 ml-2 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'rgba(255, 255, 255, 0.5)' }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 rounded-3xl overflow-hidden border border-white/10 z-50 shadow-2xl"
          style={{ 
            backgroundColor: '#1A1C19',
            maxHeight: '280px',
            overflowY: 'auto',
            animation: 'slideDown 0.2s ease-out',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
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
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                color: value === option.value ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                backgroundColor: 'transparent',
                borderTop: index === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                fontWeight: value === option.value ? 600 : 400
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check className="w-5 h-5 ml-2" style={{ color: '#FFFFFF' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}