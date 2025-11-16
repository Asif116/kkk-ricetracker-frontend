import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api, { setAuthToken } from '../utils/api';   // ✅ FIXED

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password });  // ✅ FIXED

      setAuthToken(res.data.token);  // ✅ FIXED IMPORT

      if (res.data.force_password_change) {
        setShowPasswordChange(true);
        toast.info('First time login — change password');
      } else {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    try {
      await api.post('/auth/change-password', { 
        old_password: password,
        new_password: newPassword
      });

      toast.success('Password changed!');
      setShowPasswordChange(false);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Password change failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-4">
      <Card className="w-full max-w-md shadow-2xl" data-testid="login-card">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-bold">KKK RiceTracker</CardTitle>
          <CardDescription>Rice Shop Management System</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">

            <div className="space-y-2">
              <Label>Username / Phone</Label>
              <Input
                data-testid="username-input"
                type="text"
                placeholder="0987654321"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                data-testid="password-input"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button 
              data-testid="login-button" 
              type="submit" 
              className="w-full h-12"
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Login'}
            </Button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-200">
            Demo: 0987654321 / 1234
          </div>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordChange} onOpenChange={setShowPasswordChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              First-time login — please set a new password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                data-testid="new-password-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <Button data-testid="change-password-button" type="submit" className="w-full">
              Change Password
            </Button>

          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
