import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (error) {
      console.error('Admin login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl bg-white border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Admin Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-white font-semibold bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
            >
              Access Admin Panel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;