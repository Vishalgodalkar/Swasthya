
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Appointment, getAppointmentsForPatient, getAppointmentsForDoctor, updateAppointment, generateZoomMeeting, User } from '@/lib/api';
import { Calendar, Clock, MessageSquare, Video, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { scheduleZoomMeeting, sendZoomMeetingNotification } from '@/lib/zoomUtils';
import { toast as sonnerToast } from 'sonner';

const Appointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [zoomDialogOpen, setZoomDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [generatingMeeting, setGeneratingMeeting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        let fetchedAppointments: Appointment[] = [];
        
        if (user.userType === 'patient') {
          fetchedAppointments = await getAppointmentsForPatient(user.id);
        } else if (user.userType === 'doctor') {
          fetchedAppointments = await getAppointmentsForDoctor(user.id);
        }
        
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load appointments. Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, toast]);

  const handleStatusChange = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const updatedAppointment = await updateAppointment(appointmentId, { status: newStatus });
      if (updatedAppointment) {
        setAppointments(prevAppointments =>
          prevAppointments.map(appt => appt.id === appointmentId ? updatedAppointment : appt)
        );
        
        toast({
          title: 'Status Updated',
          description: `Appointment status changed to ${newStatus}.`
        });

        // If doctor confirms a virtual appointment, generate Zoom meeting
        if (newStatus === 'confirmed' && updatedAppointment.type === 'virtual' && 
            user?.userType === 'doctor' && !updatedAppointment.zoomLink) {
          handleGenerateZoomMeeting(updatedAppointment);
        }
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update appointment status.'
      });
    }
  };

  const handleGenerateZoomMeeting = async (appointment: Appointment) => {
    if (generatingMeeting) return;
    
    setGeneratingMeeting(true);
    setSelectedAppointment(appointment);
    
    try {
      sonnerToast.loading("Generating Zoom meeting...");
      
      // Using the mock generateZoomMeeting function from api.ts
      const zoomDetails = await generateZoomMeeting(appointment.id);
      
      if (zoomDetails) {
        // Update the appointment in our local state with the zoom details
        const updatedAppointment = {
          ...appointment,
          zoomLink: zoomDetails.link,
          zoomMeetingId: zoomDetails.meetingId,
          zoomPassword: zoomDetails.password
        };
        
        setSelectedAppointment(updatedAppointment);
        
        // Update the appointments list
        setAppointments(prevAppointments =>
          prevAppointments.map(appt => appt.id === appointment.id ? updatedAppointment : appt)
        );
        
        // Notify patient about the meeting
        // In a real app, this would send an email to the patient
        sonnerToast.success("Zoom meeting created successfully!");
        
        // Show meeting details dialog
        setZoomDialogOpen(true);
      }
    } catch (error) {
      console.error('Error generating Zoom meeting:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create Zoom meeting. Please try again.'
      });
    } finally {
      setGeneratingMeeting(false);
      sonnerToast.dismiss();
    }
  };

  const handleStartZoomMeeting = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    
    if (!appointment.zoomLink) {
      if (user?.userType === 'doctor') {
        handleGenerateZoomMeeting(appointment);
      } else {
        toast({
          variant: 'destructive',
          title: 'No meeting link available',
          description: 'The doctor has not yet created the Zoom meeting. Please check back later.'
        });
      }
    } else {
      setZoomDialogOpen(true);
    }
  };

  const filterAppointments = (status: 'upcoming' | 'past' | 'all') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (status === 'upcoming') {
      return appointments.filter(appt => {
        const appointmentDate = new Date(appt.date);
        return appointmentDate >= today && appt.status !== 'cancelled';
      });
    } else if (status === 'past') {
      return appointments.filter(appt => {
        const appointmentDate = new Date(appt.date);
        return appointmentDate < today || appt.status === 'completed';
      });
    }
    
    return appointments;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isWithinOneHourOfAppointment = (appointment: Appointment): boolean => {
    const now = new Date();
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(
      parseInt(appointment.startTime.split(':')[0]),
      parseInt(appointment.startTime.split(':')[1])
    );
    
    // Calculate the difference in milliseconds
    const differenceMs = appointmentDate.getTime() - now.getTime();
    const differenceHours = differenceMs / (1000 * 60 * 60);
    
    // Return true if the appointment is within 1 hour (before or after)
    return Math.abs(differenceHours) <= 1;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/20">
      <NavBar />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your medical appointments
          </p>
        </div>

        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={(value) => setActiveTab(value as 'upcoming' | 'past' | 'all')}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            {user.userType === 'patient' && (
              <Button asChild>
                <a href="/book-appointment">Book New Appointment</a>
              </Button>
            )}
          </div>

          {['upcoming', 'past', 'all'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {loading ? (
                <div className="text-center py-10">Loading appointments...</div>
              ) : filterAppointments(tab as 'upcoming' | 'past' | 'all').length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No {tab} appointments found.</p>
                  {tab === 'upcoming' && user.userType === 'patient' && (
                    <Button variant="outline" className="mt-4" asChild>
                      <a href="/book-appointment">Book an Appointment</a>
                    </Button>
                  )}
                </div>
              ) : (
                filterAppointments(tab as 'upcoming' | 'past' | 'all').map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>
                            {user.userType === 'patient' ? (
                              <>Appointment with Dr. {appointment.doctorId}</>
                            ) : (
                              <>Appointment with {appointment.patientId}</>
                            )}
                          </CardTitle>
                          <CardDescription>{appointment.reason}</CardDescription>
                        </div>
                        <Badge className={getStatusBadgeColor(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <span>{appointment.startTime} - {appointment.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {appointment.type === 'virtual' ? (
                            <Video className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Users className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span>{appointment.type === 'virtual' ? 'Virtual Meeting' : 'In-Person'}</span>
                          {appointment.type === 'virtual' && appointment.zoomLink && (
                            <Badge variant="outline" className="ml-2">Zoom Ready</Badge>
                          )}
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold mb-1">Notes:</h4>
                          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                      {appointment.status === 'pending' && user.userType === 'doctor' && (
                        <Button onClick={() => handleStatusChange(appointment.id, 'confirmed')}>
                          Confirm
                        </Button>
                      )}
                      
                      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <Button variant="outline" onClick={() => handleStatusChange(appointment.id, 'cancelled')}>
                          Cancel
                        </Button>
                      )}
                      
                      {appointment.type === 'virtual' && appointment.status === 'confirmed' && (
                        <Button 
                          variant={isWithinOneHourOfAppointment(appointment) ? "default" : "secondary"}
                          onClick={() => handleStartZoomMeeting(appointment)}
                          className={isWithinOneHourOfAppointment(appointment) ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          {appointment.zoomLink ? "Join Meeting" : "Generate Meeting"}
                        </Button>
                      )}
                      
                      {appointment.status === 'confirmed' && user.userType === 'doctor' && (
                        <Button onClick={() => handleStatusChange(appointment.id, 'completed')}>
                          Mark Completed
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Dialog open={zoomDialogOpen} onOpenChange={setZoomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zoom Meeting Details</DialogTitle>
            <DialogDescription>
              {user?.userType === 'doctor' ? 
                "Share this information with your patient for the virtual appointment." :
                "Use the information below to join the virtual appointment."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && selectedAppointment.zoomLink && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Meeting Link</h4>
                <a 
                  href={selectedAppointment.zoomLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {selectedAppointment.zoomLink}
                </a>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Meeting ID</h4>
                <p>{selectedAppointment.zoomMeetingId}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Password</h4>
                <p>{selectedAppointment.zoomPassword}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Appointment Time</h4>
                <p>{new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.startTime}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setZoomDialogOpen(false)}>Close</Button>
            {selectedAppointment?.zoomLink && (
              <Button asChild>
                <a href={selectedAppointment.zoomLink} target="_blank" rel="noreferrer">
                  Join Now
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
