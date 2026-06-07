import { useEffect, useRef } from 'react';
import { useSelectStore } from '../../stores/select.store';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { FaCheckCircle } from 'react-icons/fa';

export interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  size?: 'default' | 'sm';
  className?: string;
  disabled?: boolean;
}

const Select = ({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  size = 'default',
  className = '',
  disabled = false,
}: Props) => {
  const { openSelectId, toggleSelect, closeSelect } = useSelectStore();
  const isOpen = openSelectId === id;

  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (isOpen) closeSelect();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, closeSelect]);

  const heightClass = size === 'sm' ? 'h-8' : 'h-9';
  const textColorClass = !selectedOption ? 'text-muted-foreground' : 'text-foreground';

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Select Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => toggleSelect(id)}
        className={`flex w-full items-center justify-between gap-2 rounded-md border-2 border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${heightClass} ${textColorClass} ${className}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>

        {isOpen ? (
          <LuChevronUp className="h-4 w-4 shrink-0 opacity-50" />
        ) : (
          <LuChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        )}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`custom-scrollbar absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${isOpen ? 'animate-dropdown-in pointer-events-auto opacity-100' : 'animate-dropdown-out pointer-events-none opacity-0'}`}
      >
        <div className="flex w-full flex-col">
          {options.map((opt) => {
            const isSelected = value === opt.value;

            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  closeSelect();
                }}
                className={`relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none transition-colors hover:bg-primary hover:text-accent-foreground ${isSelected ? 'bg-[#0284C7] text-accent-foreground' : ''}`}
              >
                {/* Item Indicator */}
                {isSelected && (
                  <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    <FaCheckCircle className="w-4 h-4" />
                  </span>
                )}

                {/* Item Text */}
                <span className="truncate">{opt.label}</span>
              </div>
            );
          })}

          {/* Fallback if options array is empty */}
          {options.length === 0 && (
            <div className="py-2 text-center text-sm text-muted-foreground">
              No options available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Select;
