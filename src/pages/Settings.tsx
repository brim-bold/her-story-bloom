import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Bell, 
  Shield, 
  Eye, 
  MessageCircle, 
  Users, 
  FileText,
  LogOut,
  Trash2,
  Moon,
  Globe,
  User,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();
  
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    messageNotifications: true,
    eventReminders: true,
    showFullProfile: true,
    showLocation: true,
    showAge: true,
    allowMessages: true,
    darkMode: false,
    dataSharing: false
  });

  // Fetch current profile and settings
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!error && data) {
        setProfile(data);
        setUsername(data.username || '');
        setSettings(prev => ({
          ...prev,
          showFullProfile: data.show_full_profile ?? true,
          showLocation: data.show_location ?? true,
          showAge: data.show_age ?? true,
          allowMessages: data.allow_messages ?? true,
        }));
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSettingChange = async (setting: string, value: boolean) => {
    if (!user) return;

    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    // Update database for privacy-related settings
    const dbSettings: Record<string, string> = {
      'showFullProfile': 'show_full_profile',
      'showLocation': 'show_location', 
      'showAge': 'show_age',
      'allowMessages': 'allow_messages'
    };

    if (dbSettings[setting]) {
      const { error } = await supabase
        .from('profiles')
        .update({ [dbSettings[setting]]: value })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating setting:', error);
        toastHook({ title: "Error updating setting", variant: "destructive" });
        // Revert the setting
        setSettings(prev => ({
          ...prev,
          [setting]: !value
        }));
      } else {
        toast.success('Setting updated');
      }
    } else {
      toast.success('Setting updated');
    }
  };

  const handleUsernameUpdate = async () => {
    if (!user || !username.trim()) return;

    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({ username: username.trim() })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating username:', error);
      if (error.code === '23505') { // Unique constraint violation
        toastHook({ title: "Username already taken", variant: "destructive" });
      } else {
        toastHook({ title: "Error updating username", variant: "destructive" });
      }
    } else {
      toastHook({ title: "Username updated successfully" });
      setProfile(prev => ({ ...prev, username: username.trim() }));
    }
    
    setSaving(false);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
    }
  };

  const handleDeleteAccount = () => {
    // This would typically show a confirmation dialog
    toast.error('Account deletion is not available in this demo');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-profile flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-profile">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground font-serif">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Profile & Username */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base">Username</Label>
                <p className="text-sm text-muted-foreground">Choose a unique username for your profile</p>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleUsernameUpdate}
                    disabled={saving || !username.trim() || username === profile?.username}
                    size="sm"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Notifications */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser notifications</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(value) => handleSettingChange('pushNotifications', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="message-notifications" className="text-base">Message Notifications</Label>
                  <p className="text-sm text-muted-foreground">New message alerts</p>
                </div>
                <Switch
                  id="message-notifications"
                  checked={settings.messageNotifications}
                  onCheckedChange={(value) => handleSettingChange('messageNotifications', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="event-reminders" className="text-base">Event Reminders</Label>
                  <p className="text-sm text-muted-foreground">Upcoming event notifications</p>
                </div>
                <Switch
                  id="event-reminders"
                  checked={settings.eventReminders}
                  onCheckedChange={(value) => handleSettingChange('eventReminders', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-full-profile" className="text-base">Show Full Profile</Label>
                  <p className="text-sm text-muted-foreground">Allow others to see your complete profile or just username</p>
                </div>
                <Switch
                  id="show-full-profile"
                  checked={settings.showFullProfile}
                  onCheckedChange={(value) => handleSettingChange('showFullProfile', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-location" className="text-base">Show Location</Label>
                  <p className="text-sm text-muted-foreground">Display your location to others</p>
                </div>
                <Switch
                  id="show-location"
                  checked={settings.showLocation}
                  onCheckedChange={(value) => handleSettingChange('showLocation', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-age" className="text-base">Show Age</Label>
                  <p className="text-sm text-muted-foreground">Display your age on profile</p>
                </div>
                <Switch
                  id="show-age"
                  checked={settings.showAge}
                  onCheckedChange={(value) => handleSettingChange('showAge', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-messages" className="text-base">Allow Messages</Label>
                  <p className="text-sm text-muted-foreground">Let others message you</p>
                </div>
                <Switch
                  id="allow-messages"
                  checked={settings.allowMessages}
                  onCheckedChange={(value) => handleSettingChange('allowMessages', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-coral" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(value) => handleSettingChange('darkMode', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Legal & Support */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                Legal & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/terms-of-service')}
              >
                <FileText className="w-4 h-4 mr-3" />
                Terms of Service
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/privacy-policy')}
              >
                <Shield className="w-4 h-4 mr-3" />
                Privacy Policy
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/help-support')}
              >
                <MessageCircle className="w-4 h-4 mr-3" />
                Help & Support
              </Button>
            </CardContent>
          </Card>

          {/* Data & Account */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                Data & Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-sharing" className="text-base">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">Share anonymized data for research</p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={settings.dataSharing}
                  onCheckedChange={(value) => handleSettingChange('dataSharing', value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive border-destructive hover:bg-destructive/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
                
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;