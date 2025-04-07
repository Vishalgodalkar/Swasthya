
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserProfile, getHealthMetrics, getMedicalReports, getEmergencyContacts } from '@/lib/api';
import SpinnerLoader from '@/components/SpinnerLoader';
import HealthMetricsChart from '@/components/HealthMetricsChart';
import EmergencyInfoCard from '@/components/EmergencyInfoCard';
import MedicalReportItem from '@/components/MedicalReportItem';
import { User, MedicalReport, HealthMetric, EmergencyContact } from '@/lib/api';
import { Heart, Stethoscope, FileCheck, Star, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [profileData, metricsData, reportsData, contactsData] = await Promise.all([
          getUserProfile(user.id),
          getHealthMetrics(user.id),
          getMedicalReports(user.id),
          getEmergencyContacts(user.id),
        ]);

        setProfile(profileData);
        setHealthMetrics(metricsData);
        setReports(reportsData);
        setEmergencyContacts(contactsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="flex h-[80vh] items-center justify-center">
          <SpinnerLoader size="lg" text="Loading your health data..." />
        </div>
      </div>
    );
  }

  // Sort reports by date
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get latest reports
  const recentReports = sortedReports.slice(0, 3);

  return (
    <div className="min-h-screen bg-muted/20">
      <NavBar />
      <main className="container py-6">
        <div className="mb-8">
          <h1>Welcome, {profile.name}</h1>
          <p className="text-muted-foreground">Your health passport dashboard</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main content - 2 columns */}
          <div className="space-y-6 md:col-span-2">
            {/* Health metrics */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-health-blue-500" />
                  Health Metrics
                </h2>
                <Link to="/metrics">
                  <Button variant="outline" size="sm" className="flex items-center">
                    All Metrics
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <HealthMetricsChart 
                  metrics={healthMetrics}
                  title="Heart Rate"
                  type="heart_rate"
                  color="#ef4444"
                />
                <HealthMetricsChart 
                  metrics={healthMetrics}
                  title="Weight"
                  type="weight"
                  color="#6366f1"
                />
              </div>
            </div>

            {/* Recent medical reports */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileCheck className="mr-2 h-5 w-5 text-health-blue-500" />
                  Recent Medical Reports
                </h2>
                <div className="flex gap-2">
                  <Link to="/reports/new">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Plus className="mr-1 h-4 w-4" />
                      New Report
                    </Button>
                  </Link>
                  <Link to="/reports">
                    <Button variant="outline" size="sm" className="flex items-center">
                      All Reports
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {recentReports.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recentReports.map((report) => (
                    <MedicalReportItem key={report.id} report={report} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <FileCheck className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-lg font-medium mb-1">No Medical Reports Yet</p>
                    <p className="text-muted-foreground mb-4 text-center">
                      Upload your first medical report to keep track of your health history.
                    </p>
                    <Link to="/reports/new">
                      <Button className="health-gradient">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Medical Report
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Health tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  Health Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border bg-card p-3">
                    <h4 className="font-medium">Stay Hydrated</h4>
                    <p className="text-sm text-muted-foreground">
                      Drinking 8 glasses of water daily helps maintain energy levels and supports organ function.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <h4 className="font-medium">Regular Exercise</h4>
                    <p className="text-sm text-muted-foreground">
                      Aim for at least 30 minutes of moderate exercise most days of the week.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <h4 className="font-medium">Sleep Well</h4>
                    <p className="text-sm text-muted-foreground">
                      Adults need 7-9 hours of quality sleep per night for optimal health.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Emergency information card */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-health-blue-500" />
                Emergency Information
              </h2>
              <EmergencyInfoCard user={profile} contacts={emergencyContacts} minimal={true} />
              <div className="mt-2 text-center">
                <Link to="/emergency">
                  <Button variant="outline" size="sm" className="w-full">
                    View Complete Emergency Info
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick access */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/reports/new">
                  <Button variant="secondary" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Medical Report
                  </Button>
                </Link>
                <Link to="/metrics/add">
                  <Button variant="secondary" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Health Metric
                  </Button>
                </Link>
                <Link to="/emergency/edit">
                  <Button variant="secondary" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Update Emergency Info
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
