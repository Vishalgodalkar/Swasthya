
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { getAllDoctors, getDoctorAvailability, createAppointment, TimeSlot, DoctorProfile, User } from '@/lib/api';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Video, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Doctor {
  id: string;
  name: string;
  specialization?: string;
  hospital?: string;
  doctorProfile?: DoctorProfile;
}

const BookAppointment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [appointmentType, setAppointmentType] = useState<'virtual' | 'in-person'>('virtual');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchDoctors = async () => {
      try {
        const fetchedDoctors = await getAllDoctors();
        setDoctors(fetchedDoctors.map(doctor => ({
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.doctorProfile?.specialization,
          hospital: doctor.doctorProfile?.hospital,
          doctorProfile: doctor.doctorProfile
        })));
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load doctors. Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [user, toast]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchAvailability = async () => {
        try {
          const slots = await getDoctorAvailability(selectedDoctor);
          // Filter slots for the selected day
          const dayName = format(selectedDate, 'EEEE');
          const availableSlotsForDay = slots.filter(slot => 
            slot.day === dayName && !slot.isBooked
          );
          setAvailableSlots(availableSlotsForDay);
        } catch (error) {
          console.error('Error fetching availability:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load doctor availability.'
          });
        }
      };

      fetchAvailability();
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, selectedDate, toast]);

  const handleBookAppointment = async () => {
    if (!user || !selectedDoctor || !selectedDate || !selectedSlot || !reason) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill in all required fields to book an appointment.'
      });
      return;
    }

    setSubmitting(true);
    try {
      const appointmentData = {
        doctorId: selectedDoctor,
        patientId: user.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        status: 'pending' as const,
        type: appointmentType,
        reason,
        notes
      };

      await createAppointment(appointmentData);
      
      toast({
        title: 'Appointment Booked',
        description: appointmentType === 'virtual' ? 
          'Your virtual appointment has been scheduled. Zoom meeting details will be available once confirmed.' : 
          'Your in-person appointment has been successfully booked.'
      });
      
      navigate('/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to book appointment. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  const selectedDoctorData = doctors.find(doctor => doctor.id === selectedDoctor);

  return (
    <div className="min-h-screen bg-muted/20">
      <NavBar />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
          <p className="text-muted-foreground">
            Schedule a consultation with one of our healthcare professionals
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select a Doctor</CardTitle>
                <CardDescription>Choose a healthcare professional for your appointment</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading doctors...</div>
                ) : doctors.length === 0 ? (
                  <div className="text-center py-4">No doctors available at the moment.</div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {doctors.map((doctor) => (
                      <Card 
                        key={doctor.id} 
                        className={`cursor-pointer transition-all ${selectedDoctor === doctor.id ? 'border-primary' : 'border-border'}`}
                        onClick={() => setSelectedDoctor(doctor.id)}
                      >
                        <CardContent className="p-4 flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">Dr. {doctor.name}</h3>
                            {doctor.specialization && <p className="text-sm text-muted-foreground">{doctor.specialization}</p>}
                            {doctor.hospital && <p className="text-xs text-muted-foreground">{doctor.hospital}</p>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>Select your preferred date and time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                          disabled={!selectedDoctor}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP') : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => {
                            // Disable dates in the past and today
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Slot</Label>
                    <Select
                      disabled={!selectedDate || availableSlots.length === 0}
                      onValueChange={(value) => {
                        const slot = availableSlots.find(s => `${s.startTime}-${s.endTime}` === value);
                        setSelectedSlot(slot || null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.length === 0 ? (
                          <SelectItem value="none" disabled>No available slots</SelectItem>
                        ) : (
                          availableSlots.map((slot) => (
                            <SelectItem key={`${slot.startTime}-${slot.endTime}`} value={`${slot.startTime}-${slot.endTime}`}>
                              {slot.startTime} - {slot.endTime}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Appointment Type</Label>
                  <RadioGroup defaultValue="virtual" onValueChange={(value) => setAppointmentType(value as 'virtual' | 'in-person')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="virtual" id="virtual" />
                      <Label htmlFor="virtual" className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        Virtual (Zoom)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-person" id="in-person" />
                      <Label htmlFor="in-person" className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        In-Person
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Brief description of your medical concern"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information that might be helpful for the doctor"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => navigate('/appointments')}>
                Cancel
              </Button>
              <Button 
                onClick={handleBookAppointment} 
                disabled={!selectedDoctor || !selectedDate || !selectedSlot || !reason || submitting}
              >
                {submitting ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDoctor ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Doctor</h3>
                      <p className="text-sm text-muted-foreground">
                        Dr. {selectedDoctorData?.name || ''}
                      </p>
                      {selectedDoctorData?.specialization && (
                        <p className="text-xs text-muted-foreground">
                          {selectedDoctorData.specialization}
                        </p>
                      )}
                    </div>
                    
                    {selectedDate && (
                      <div>
                        <h3 className="text-sm font-medium">Date</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(selectedDate, 'PPP')}
                        </p>
                      </div>
                    )}
                    
                    {selectedSlot && (
                      <div>
                        <h3 className="text-sm font-medium">Time</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedSlot.startTime} - {selectedSlot.endTime}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium">Appointment Type</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {appointmentType === 'virtual' ? 
                          <><Video className="h-4 w-4 mr-1" /> Virtual (Zoom)</> : 
                          <><Users className="h-4 w-4 mr-1" /> In-Person</>
                        }
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a doctor and appointment details to see a summary
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you need assistance booking an appointment or have any questions, please contact our support team.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;
