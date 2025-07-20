"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  clinicId?: string;
  clinic?: any;
  isSuperAdmin?: boolean;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isClinicUser: boolean;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permission definitions
export const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Clinic Management
  CLINIC_CREATE: 'clinic:create',
  CLINIC_READ: 'clinic:read',
  CLINIC_UPDATE: 'clinic:update',
  CLINIC_DELETE: 'clinic:delete',
  
  // Patient Management
  PATIENT_CREATE: 'patient:create',
  PATIENT_READ: 'patient:read',
  PATIENT_UPDATE: 'patient:update',
  PATIENT_DELETE: 'patient:delete',
  
  // Offer Management
  OFFER_CREATE: 'offer:create',
  OFFER_READ: 'offer:read',
  OFFER_UPDATE: 'offer:update',
  OFFER_DELETE: 'offer:delete',
  
  // Support Management
  SUPPORT_CREATE: 'support:create',
  SUPPORT_READ: 'support:read',
  SUPPORT_UPDATE: 'support:update',
  SUPPORT_DELETE: 'support:delete',
  
  // Analytics
  ANALYTICS_READ: 'analytics:read',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // System Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
} as const;

// Role-based permissions
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  ADMIN: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.PATIENT_CREATE,
    PERMISSIONS.PATIENT_READ,
    PERMISSIONS.PATIENT_UPDATE,
    PERMISSIONS.OFFER_CREATE,
    PERMISSIONS.OFFER_READ,
    PERMISSIONS.OFFER_UPDATE,
    PERMISSIONS.SUPPORT_CREATE,
    PERMISSIONS.SUPPORT_READ,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.SETTINGS_READ,
  ],
  SALES: [
    PERMISSIONS.PATIENT_READ,
    PERMISSIONS.OFFER_CREATE,
    PERMISSIONS.OFFER_READ,
    PERMISSIONS.OFFER_UPDATE,
    PERMISSIONS.SUPPORT_CREATE,
    PERMISSIONS.SUPPORT_READ,
  ],
  DOCTOR: [
    PERMISSIONS.PATIENT_READ,
    PERMISSIONS.PATIENT_UPDATE,
    PERMISSIONS.OFFER_READ,
    PERMISSIONS.SUPPORT_CREATE,
    PERMISSIONS.SUPPORT_READ,
  ],
  ASSISTANT: [
    PERMISSIONS.PATIENT_READ,
    PERMISSIONS.OFFER_READ,
    PERMISSIONS.SUPPORT_CREATE,
    PERMISSIONS.SUPPORT_READ,
  ],
} as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  
  const user = session?.user as User | null;
  const isLoading = status === 'loading';
  const isAuthenticated = !!user;
  const isSuperAdmin = user?.isSuperAdmin || false;
  const isClinicUser = !!user?.clinicId;
  
  // Get permissions based on user role
  const getPermissions = (): string[] => {
    if (!user?.role) return [];
    
    const rolePermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS];
    return rolePermissions ? [...rolePermissions] : [];
  };
  
  const permissions = getPermissions();
  
  // Permission check functions
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };
  
  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(permission => hasPermission(permission));
  };
  
  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => hasPermission(permission));
  };
  
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isSuperAdmin,
    isClinicUser,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 