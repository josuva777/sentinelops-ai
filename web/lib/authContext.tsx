'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'SUPER_ADMIN' | 'SECOPS_ARCHITECT' | 'OPERATOR' | 'DEVELOPER';
export type PlanTier = 'FREE' | 'TEAM' | 'ENTERPRISE';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  tier: PlanTier;
  toolCallsUsed: number;
  toolCallsLimit: number;
  isSuspended: boolean;
  ipAddress: string;
  device: string;
  lastActive: string;
}

interface AuthContextType {
  currentUser: UserSession;
  allUsers: UserSession[];
  login: (email: string, role?: UserRole) => { success: boolean; error?: string };
  register: (name: string, email: string, company: string) => { success: boolean; error?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  upgradePlan: (tier: PlanTier) => void;
  suspendUser: (userId: string) => void;
  reactivateUser: (userId: string) => void;
  simulateQuotaUsage: (amount: number) => void;
  isQuotaExceeded: boolean;
}

// Anti-Sybil / Disposable Fake Email Domain Blocklist
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com', 'mailinator.com', '10minutemail.com', 'guerrillamail.com',
  'sharklasers.com', 'yopmail.com', 'dispostable.com', 'trashmail.com',
  'getairmail.com', 'mytemp.email', 'tempail.com', 'fakeinbox.com',
  'throwawaymail.com', 'burnermail.io', 'generator.email'
]);

const INITIAL_USERS: UserSession[] = [
  {
    id: 'usr_admin_01',
    name: 'Elena Rostova',
    email: 'elena.rostova@enterprise.corp',
    company: 'Apex Global Inc.',
    role: 'SUPER_ADMIN',
    tier: 'TEAM',
    toolCallsUsed: 48200,
    toolCallsLimit: 1000000,
    isSuspended: false,
    ipAddress: '198.51.100.42 (US-East)',
    device: 'Windows 11 Chrome Desktop (Hardware Key Verified)',
    lastActive: 'Active now',
  },
  {
    id: 'usr_dev_02',
    name: 'Devon Vance',
    email: 'devon@autonomous-agents.dev',
    company: 'AgentCraft Labs',
    role: 'DEVELOPER',
    tier: 'FREE',
    toolCallsUsed: 49850,
    toolCallsLimit: 50000,
    isSuspended: false,
    ipAddress: '203.0.113.19 (EU-West)',
    device: 'macOS Safari Desktop',
    lastActive: '14 minutes ago',
  },
  {
    id: 'usr_suspect_03',
    name: 'AutoScraper Bot #88',
    email: 'scraper88@temp-bot-proxy.net',
    company: 'Suspicious Fleet',
    role: 'DEVELOPER',
    tier: 'FREE',
    toolCallsUsed: 50000,
    toolCallsLimit: 50000,
    isSuspended: true,
    ipAddress: '185.220.101.5 (Tor Exit Node)',
    device: 'Headless Python HTTP Client',
    lastActive: 'Blocked 2 hours ago',
  },
];

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserSession>(INITIAL_USERS[1]); // Default to Devon Vance (DEVELOPER, FREE tier)
  const [allUsers, setAllUsers] = useState<UserSession[]>(INITIAL_USERS);

  // Load session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sentinelops_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
      } catch (e) {
        console.error('Failed to parse auth session:', e);
      }
    }
  }, []);

  const saveUserSession = (user: UserSession) => {
    setCurrentUser(user);
    localStorage.setItem('sentinelops_auth_session', JSON.stringify(user));
  };

  const login = (email: string, role: UserRole = 'SUPER_ADMIN') => {
    const trimmed = email.trim().toLowerCase();
    const existing = allUsers.find((u) => u.email.toLowerCase() === trimmed);
    if (existing) {
      if (existing.isSuspended) {
        return { success: false, error: 'Account Suspended: This user was locked by an Enterprise Administrator due to policy violations.' };
      }
      saveUserSession(existing);
      return { success: true };
    }

    // Default demo login
    const newUser: UserSession = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      company: 'Apex Global Inc.',
      role,
      tier: role === 'SUPER_ADMIN' ? 'TEAM' : 'FREE',
      toolCallsUsed: 12500,
      toolCallsLimit: role === 'SUPER_ADMIN' ? 1000000 : 50000,
      isSuspended: false,
      ipAddress: '127.0.0.1 (Local Verified)',
      device: 'Chrome Windows Workstation',
      lastActive: 'Active now',
    };
    setAllUsers((prev) => [newUser, ...prev]);
    saveUserSession(newUser);
    return { success: true };
  };

  const register = (name: string, email: string, company: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain || DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
      return {
        success: false,
        error: 'Anti-Sybil Defense: Disposable, temporary, or burner email domains are strictly prohibited for enterprise tenant creation.',
      };
    }

    const newUser: UserSession = {
      id: `usr_${Date.now()}`,
      name,
      email,
      company,
      role: 'DEVELOPER',
      tier: 'FREE',
      toolCallsUsed: 0,
      toolCallsLimit: 50000,
      isSuspended: false,
      ipAddress: '127.0.0.1 (Localhost)',
      device: 'Desktop Browser',
      lastActive: 'Active now',
    };

    setAllUsers((prev) => [newUser, ...prev]);
    saveUserSession(newUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('sentinelops_auth_session');
    // Reset to default developer view
    const defaultDev = allUsers[1];
    setCurrentUser(defaultDev);
  };

  const switchRole = (role: UserRole) => {
    const updated = {
      ...currentUser,
      role,
      tier: role === 'SUPER_ADMIN' ? 'TEAM' : currentUser.tier,
    };
    saveUserSession(updated);
  };

  const upgradePlan = (tier: PlanTier) => {
    const limit = tier === 'FREE' ? 50000 : tier === 'TEAM' ? 1000000 : 10000000;
    const updated: UserSession = {
      ...currentUser,
      tier,
      toolCallsLimit: limit,
      role: tier === 'ENTERPRISE' || tier === 'TEAM' ? 'SUPER_ADMIN' : currentUser.role,
    };
    saveUserSession(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const suspendUser = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const suspended = { ...u, isSuspended: true, lastActive: 'Suspended by Admin' };
          if (currentUser.id === userId) saveUserSession(suspended);
          return suspended;
        }
        return u;
      })
    );
  };

  const reactivateUser = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const active = { ...u, isSuspended: false, lastActive: 'Reactivated' };
          if (currentUser.id === userId) saveUserSession(active);
          return active;
        }
        return u;
      })
    );
  };

  const simulateQuotaUsage = (amount: number) => {
    const updated = {
      ...currentUser,
      toolCallsUsed: Math.min(currentUser.toolCallsLimit, currentUser.toolCallsUsed + amount),
    };
    saveUserSession(updated);
  };

  const isQuotaExceeded = currentUser.toolCallsUsed >= currentUser.toolCallsLimit;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        login,
        register,
        logout,
        switchRole,
        upgradePlan,
        suspendUser,
        reactivateUser,
        simulateQuotaUsage,
        isQuotaExceeded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
