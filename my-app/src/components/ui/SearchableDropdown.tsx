"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value: string | string[];
  onChange: (value: any) => void;
  placeholder?: string;
  isMulti?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isMulti = false,
  disabled = false,
  className = "",
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    if (isMulti) {
      const currentValue = Array.isArray(value) ? value : [];
      if (currentValue.includes(optionValue)) {
        onChange(currentValue.filter((v) => v !== optionValue));
      } else {
        onChange([...currentValue, optionValue]);
      }
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (isMulti) {
      const currentValue = Array.isArray(value) ? value : [];
      if (currentValue.length === 0) return placeholder;
      if (currentValue.length === 1) {
        return options.find((o) => o.value === currentValue[0])?.label || placeholder;
      }
      return `${currentValue.length} selected`;
    } else {
      return options.find((o) => o.value === value)?.label || placeholder;
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-input px-3 py-2 text-[13px] text-text-primary disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <span className="truncate">{getDisplayValue()}</span>
        <ChevronDown size={14} className="text-text-secondary shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          <div className="sticky top-0 bg-card p-2 border-b border-border z-10">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-disabled" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-border bg-input py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none"
                placeholder="Search..."
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <ul className="py-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-center text-xs text-text-secondary">No options found</li>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = isMulti 
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value;
                  
                return (
                  <li
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className="flex cursor-pointer items-center justify-between px-3 py-2 text-[13px] text-text-primary hover:bg-primary/5 hover:text-primary motion-safe:transition-colors"
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check size={14} className="text-primary" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
