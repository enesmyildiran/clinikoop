import { ReactNode } from "react";

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`bg-white rounded-xl shadow border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
} 