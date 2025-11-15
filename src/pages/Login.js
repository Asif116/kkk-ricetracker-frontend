import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API } from '../utils/api';

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
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      setAuthToken(res.data.token);

      if (res.data.force_password_change) {
        setShowPasswordChange(true);
        setOldPassword(password);
        toast.info('First time login—password change pannunga');
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
    if (!newPassword || newPassword.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    try {
      await axios.post(`${API}/auth/change-password`, {
        old_password: oldPassword,
        new_password: newPassword
      });
      toast.success('Password changed successfully!');
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
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold">KKK RiceTracker</CardTitle>
          <CardDescription className="text-base">Rice Shop Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username / Phone</Label>
              <Input
                id="username"
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                data-testid="password-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button
              data-testid="login-button"
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo: 0987654321 / 1234</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPasswordChange} onOpenChange={setShowPasswordChange}>
        <DialogContent data-testid="password-change-dialog">
          <DialogHeader>
            <DialogTitle>Change Password Required</DialogTitle>
            <DialogDescription>
              First time login—please change your password to continue.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                data-testid="new-password-input"
                type="password"
                placeholder="Enter new password"
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
