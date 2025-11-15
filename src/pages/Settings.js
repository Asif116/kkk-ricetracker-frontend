import { useEffect, useState } from 'react';
import axios from 'axios';

import { API } from '../utils/api';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

const Settings = () => {
  const [profile, setProfile] = useState({ name: '', phone: '', email: '' });
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`);
      setProfile(res.data);
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/settings`, profile);
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/change-password`, passwordData);
      toast.success('Password changed successfully');
      setShowPasswordDialog(false);
      setPasswordData({ old_password: '', new_password: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change password');
    }
  };

  return (
    <div data-testid="settings-page" className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                data-testid="profile-name-input"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                data-testid="profile-phone-input"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                data-testid="profile-email-input"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <Button data-testid="save-profile-button" type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogTrigger asChild>
              <Button data-testid="change-password-trigger" variant="outline" className="w-full">
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="change-password-dialog">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
              </DialogHeader>
              <form onSubmit={changePassword} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Old Password</Label>
                  <Input
                    data-testid="old-password-input"
                    type="password"
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    data-testid="new-password-input"
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    required
                  />
                </div>
                <Button data-testid="save-password-button" type="submit" className="w-full">
                  Change Password
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
