import React from 'react'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`w-full max-w-5xl mx-auto px-6 py-6 ${className}`}>
      {children}
    </div>
  )
} 