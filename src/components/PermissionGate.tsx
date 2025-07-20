"use client";

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionGateProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback = null
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();
  
  let hasAccess = true;
  
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }
  
  if (!hasAccess) {
    return fallback;
  }
  
  return <>{children}</>;
}

// Convenience components for common permission checks
export function UserCreateGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate permission="user:create" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function UserReadGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate permission="user:read" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function PatientCreateGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate permission="patient:create" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function OfferCreateGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate permission="offer:create" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function SupportCreateGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate permission="support:create" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function AnalyticsReadGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGate permission="analytics:read" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function SuperAdminGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const { isSuperAdmin } = useAuth();
  
  if (!isSuperAdmin) {
    return fallback;
  }
  
  return <>{children}</>;
}

export function ClinicUserGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const { isClinicUser } = useAuth();
  
  if (!isClinicUser) {
    return fallback;
  }
  
  return <>{children}</>;
} 