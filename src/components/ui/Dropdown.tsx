"use client"

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  align?: 'left' | 'right'
  width?: 'auto' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Dropdown: React.FC<DropdownProps> = ({ 
  trigger, 
  children, 
  className = '',
  align = 'left',
  width = 'auto'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const widthClasses = {
    auto: 'w-auto',
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64',
    xl: 'w-80'
  }

  const alignClasses = {
    left: 'left-0',
    right: 'right-0'
  }

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div className={cn(
          'absolute top-full mt-1 z-50',
          alignClasses[align],
          widthClasses[width]
        )}>
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ 
  children, 
  onClick, 
  className = '',
  disabled = false 
}) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        'px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-700',
        className
      )}
    >
      {children}
    </div>
  )
}

interface DropdownTriggerProps {
  children: React.ReactNode
  isOpen: boolean
  className?: string
}

export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ 
  children, 
  isOpen, 
  className = '' 
}) => {
  return (
    <div className={cn(
      'flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors',
      className
    )}>
      {children}
      {isOpen ? (
        <ChevronUp className="h-4 w-4 text-gray-500 ml-2" />
      ) : (
        <ChevronDown className="h-4 w-4 text-gray-500 ml-2" />
      )}
    </div>
  )
} 