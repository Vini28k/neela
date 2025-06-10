import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'super_admin';
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
  isAdminLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session
    const savedAdminUser = localStorage.getItem('adminUser');
    if (savedAdminUser) {
      setAdminUser(JSON.parse(savedAdminUser));
    }
    setIsAdminLoading(false);
  }, []);

  const adminLogin = async (email: string, password: string) => {
    // Mock admin login - replace with actual authentication
    const mockAdminUser = { id: '1', email, name: 'Admin', role: 'admin' as const };
    setAdminUser(mockAdminUser);
    localStorage.setItem('adminUser', JSON.stringify(mockAdminUser));
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, adminLogin, adminLogout, isAdminLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};