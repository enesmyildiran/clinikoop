import { ReactNode } from "react";

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`bg-white rounded-xl shadow border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-6 pb-0 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: { className?: string; children: ReactNode }) {
  return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>;
}

export function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
} 