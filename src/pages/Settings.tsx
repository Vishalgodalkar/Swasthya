
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      shareWithDoctors: true,
      shareAnonymizedData: false,
      allowEmergencyAccess: true
    }
  });
  
  const handleSwitchChange = (category: keyof typeof settings, setting: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof settings],
        [setting]: checked
      }
    }));
  };
  
  const saveSettings = () => {
    // In a real app, this would save to an API
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been successfully updated.',
    });
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <NavBar />
      <main className="container py-6">
        <div className="mb-6">
          <h1>Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and privacy settings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 md:col-span-2">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and alerts via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => handleSwitchChange('notifications', 'email', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your devices
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => handleSwitchChange('notifications', 'push', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important alerts via SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) => handleSwitchChange('notifications', 'sms', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-with-doctors">Share with Doctors</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow doctors to access your health passport when provided with access code
                    </p>
                  </div>
                  <Switch
                    id="share-with-doctors"
                    checked={settings.privacy.shareWithDoctors}
                    onCheckedChange={(checked) => handleSwitchChange('privacy', 'shareWithDoctors', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="anonymized-data">Anonymized Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Share anonymized health data for research purposes
                    </p>
                  </div>
                  <Switch
                    id="anonymized-data"
                    checked={settings.privacy.shareAnonymizedData}
                    onCheckedChange={(checked) => handleSwitchChange('privacy', 'shareAnonymizedData', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emergency-access">Emergency Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow emergency responders to access critical information
                    </p>
                  </div>
                  <Switch
                    id="emergency-access"
                    checked={settings.privacy.allowEmergencyAccess}
                    onCheckedChange={(checked) => handleSwitchChange('privacy', 'allowEmergencyAccess', checked)}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={saveSettings} className="health-gradient">
                Save Settings
              </Button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* App Info */}
            <Card>
              <CardHeader>
                <CardTitle>App Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">VitaSecure Health</h3>
                  <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Last Sync</h3>
                  <p className="text-sm text-muted-foreground">Today at 10:23 AM</p>
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full">Check for Updates</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Export Health Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Sync Devices
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
            
            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="link" className="w-full justify-start p-0 h-auto">
                  Contact Support
                </Button>
                <Button variant="link" className="w-full justify-start p-0 h-auto">
                  FAQ
                </Button>
                <Button variant="link" className="w-full justify-start p-0 h-auto">
                  Privacy Policy
                </Button>
                <Button variant="link" className="w-full justify-start p-0 h-auto">
                  Terms of Service
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
