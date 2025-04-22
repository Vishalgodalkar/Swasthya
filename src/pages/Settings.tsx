import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Shield, Download, ArrowRight, HelpCircle } from 'lucide-react';
import { reportsAPI } from '@/lib/apiService';

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

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeSupport, setActiveSupport] = useState<string | null>(null);
  
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

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    
    // Validate passwords
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords Do Not Match',
        description: 'Your new password and confirmation do not match.',
      });
      setIsChangingPassword(false);
      return;
    }
    
    if (passwords.newPassword.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Password Too Short',
        description: 'Your password must be at least 8 characters long.',
      });
      setIsChangingPassword(false);
      return;
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully changed.',
      });
      
      // Reset form
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      
      setIsChangingPassword(false);
    }, 1500);
  };

  const handleExportHealthData = async () => {
    setIsExporting(true);
    
    try {
      // In a real app, this would call an API endpoint to get the data
      // For now, we'll simulate it
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock data object
      const healthData = {
        user: {
          name: user?.name || 'User',
          id: user?.id || 'user-1'
        },
        reports: await reportsAPI.getAll(),
        metrics: [
          {
            type: 'blood-pressure',
            readings: [
              { value: '120/80', date: '2025-04-01' },
              { value: '118/78', date: '2025-04-10' }
            ]
          },
          {
            type: 'heart-rate',
            readings: [
              { value: '72', date: '2025-04-01' },
              { value: '68', date: '2025-04-10' }
            ]
          }
        ],
        medications: [
          { name: 'Medication A', dosage: '10mg', frequency: 'Daily' },
          { name: 'Medication B', dosage: '5mg', frequency: 'Twice daily' }
        ]
      };
      
      // Convert to JSON string
      const dataStr = JSON.stringify(healthData, null, 2);
      
      // Create a download link
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'health-data-export.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: 'Data Exported Successfully',
        description: 'Your health data has been downloaded.',
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'There was an error exporting your health data.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const toggleSupportItem = (item: string) => {
    if (activeSupport === item) {
      setActiveSupport(null);
    } else {
      setActiveSupport(item);
    }
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
              <CardFooter>
                <Button onClick={saveSettings} variant="outline">Save Notification Settings</Button>
              </CardFooter>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader className="flex flex-row items-center">
                <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
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
              <CardFooter>
                <Button onClick={saveSettings} className="health-gradient">
                  Save Privacy Settings
                </Button>
              </CardFooter>
            </Card>
            
            {/* Password Change */}
            <Card>
              <CardHeader className="flex flex-row items-center">
                <Lock className="mr-2 h-5 w-5 text-muted-foreground" />
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={passwords.confirmNewPassword}
                      onChange={(e) => setPasswords({...passwords, confirmNewPassword: e.target.value})}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isChangingPassword || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmNewPassword}
                  >
                    {isChangingPassword ? 'Updating Password...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
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
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleExportHealthData}
                  disabled={isExporting}
                >
                  {isExporting ? 'Exporting...' : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export Health Data
                    </>
                  )}
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
              <CardHeader className="flex flex-row items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                <CardTitle>Help & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg divide-y">
                  <div className="p-3">
                    <Button 
                      variant="ghost" 
                      className="w-full flex justify-between items-center p-0 h-auto"
                      onClick={() => toggleSupportItem('contact')}
                    >
                      <span>Contact Support</span>
                      <ArrowRight className={`h-4 w-4 transition-transform ${activeSupport === 'contact' ? 'rotate-90' : ''}`} />
                    </Button>
                    
                    {activeSupport === 'contact' && (
                      <div className="mt-3 pl-2 border-l-2 border-muted">
                        <p className="text-sm mb-2">Our support team is available 24/7</p>
                        <p className="text-sm font-medium">Email: support@telehealth.com</p>
                        <p className="text-sm font-medium">Phone: +1 (800) 123-4567</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <Button 
                      variant="ghost" 
                      className="w-full flex justify-between items-center p-0 h-auto"
                      onClick={() => toggleSupportItem('faq')}
                    >
                      <span>FAQ</span>
                      <ArrowRight className={`h-4 w-4 transition-transform ${activeSupport === 'faq' ? 'rotate-90' : ''}`} />
                    </Button>
                    
                    {activeSupport === 'faq' && (
                      <div className="mt-3 pl-2 border-l-2 border-muted space-y-2">
                        <p className="text-sm font-medium">How do I book an appointment?</p>
                        <p className="text-sm mb-2">Navigate to the Doctors page and select a doctor to book an appointment.</p>
                        
                        <p className="text-sm font-medium">How do I view my medical reports?</p>
                        <p className="text-sm mb-2">Go to the Reports section in the sidebar to view all your medical reports.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <Button 
                      variant="ghost" 
                      className="w-full flex justify-between items-center p-0 h-auto"
                      onClick={() => toggleSupportItem('privacy')}
                    >
                      <span>Privacy Policy</span>
                      <ArrowRight className={`h-4 w-4 transition-transform ${activeSupport === 'privacy' ? 'rotate-90' : ''}`} />
                    </Button>
                    
                    {activeSupport === 'privacy' && (
                      <div className="mt-3 pl-2 border-l-2 border-muted">
                        <p className="text-sm">Our detailed privacy policy can be found <a href="#" className="text-blue-600 hover:underline">here</a>.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <Button 
                      variant="ghost" 
                      className="w-full flex justify-between items-center p-0 h-auto"
                      onClick={() => toggleSupportItem('terms')}
                    >
                      <span>Terms of Service</span>
                      <ArrowRight className={`h-4 w-4 transition-transform ${activeSupport === 'terms' ? 'rotate-90' : ''}`} />
                    </Button>
                    
                    {activeSupport === 'terms' && (
                      <div className="mt-3 pl-2 border-l-2 border-muted">
                        <p className="text-sm">Our terms of service can be found <a href="#" className="text-blue-600 hover:underline">here</a>.</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
