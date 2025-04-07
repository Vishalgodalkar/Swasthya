
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegisterData } from '@/lib/api';

const Register = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    bloodType: 'O+',
    height: 170,
    weight: 70,
    allergies: [],
    chronicConditions: [],
    medications: []
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');

  const handleBasicInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleBloodTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, bloodType: value }));
  };

  const addAllergy = () => {
    if (allergyInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()]
      }));
      setAllergyInput('');
    }
  };

  const removeAllergy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const addCondition = () => {
    if (conditionInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        chronicConditions: [...prev.chronicConditions, conditionInput.trim()]
      }));
      setConditionInput('');
    }
  };

  const removeCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      chronicConditions: prev.chronicConditions.filter((_, i) => i !== index)
    }));
  };

  const addMedication = () => {
    if (medicationInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        medications: [...prev.medications, medicationInput.trim()]
      }));
      setMedicationInput('');
    }
  };

  const removeMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate data
      const now = new Date();
      const dob = new Date(formData.dateOfBirth);
      if (dob > now) {
        alert('Date of birth cannot be in the future');
        setActiveTab('basic');
        return;
      }
      
      const success = await register(formData);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextTab = () => {
    // Basic validation
    if (activeTab === 'basic') {
      if (!formData.name || !formData.email || !formData.password || !formData.dateOfBirth) {
        alert('Please fill in all required fields');
        return;
      }
      setActiveTab('health');
    } else if (activeTab === 'health') {
      setActiveTab('medical');
    }
  };

  const handlePrevTab = () => {
    if (activeTab === 'health') {
      setActiveTab('basic');
    } else if (activeTab === 'medical') {
      setActiveTab('health');
    }
  };

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo size="lg" />
        </div>
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Set up your VitaSecure Health Passport
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
                  <TabsTrigger value="health" className="flex-1">Health Data</TabsTrigger>
                  <TabsTrigger value="medical" className="flex-1">Medical Info</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleBasicInputChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleBasicInputChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleBasicInputChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleBasicInputChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full health-gradient"
                    onClick={handleNextTab}
                    disabled={isSubmitting}
                  >
                    Next
                  </Button>
                </TabsContent>

                <TabsContent value="health" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Select
                        value={formData.bloodType}
                        onValueChange={handleBloodTypeChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="bloodType">
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        value={formData.height}
                        onChange={handleNumericInputChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleNumericInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex justify-between gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevTab}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 health-gradient"
                      onClick={handleNextTab}
                      disabled={isSubmitting}
                    >
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="medical" className="space-y-4">
                  <div className="space-y-3">
                    <Label>Allergies</Label>
                    <div className="flex gap-2">
                      <Input
                        value={allergyInput}
                        onChange={(e) => setAllergyInput(e.target.value)}
                        placeholder="Enter allergy"
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addAllergy}
                        disabled={isSubmitting || !allergyInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    {formData.allergies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {formData.allergies.map((allergy, index) => (
                          <div
                            key={index}
                            className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center"
                          >
                            {allergy}
                            <button
                              type="button"
                              className="ml-1 rounded-full bg-red-200 text-red-600 hover:bg-red-300 h-4 w-4 flex items-center justify-center"
                              onClick={() => removeAllergy(index)}
                              disabled={isSubmitting}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Chronic Conditions</Label>
                    <div className="flex gap-2">
                      <Input
                        value={conditionInput}
                        onChange={(e) => setConditionInput(e.target.value)}
                        placeholder="Enter condition"
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addCondition}
                        disabled={isSubmitting || !conditionInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    {formData.chronicConditions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {formData.chronicConditions.map((condition, index) => (
                          <div
                            key={index}
                            className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center"
                          >
                            {condition}
                            <button
                              type="button"
                              className="ml-1 rounded-full bg-yellow-200 text-yellow-600 hover:bg-yellow-300 h-4 w-4 flex items-center justify-center"
                              onClick={() => removeCondition(index)}
                              disabled={isSubmitting}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Medications</Label>
                    <div className="flex gap-2">
                      <Input
                        value={medicationInput}
                        onChange={(e) => setMedicationInput(e.target.value)}
                        placeholder="Enter medication"
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addMedication}
                        disabled={isSubmitting || !medicationInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    {formData.medications.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {formData.medications.map((medication, index) => (
                          <div
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                          >
                            {medication}
                            <button
                              type="button"
                              className="ml-1 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300 h-4 w-4 flex items-center justify-center"
                              onClick={() => removeMedication(index)}
                              disabled={isSubmitting}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevTab}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 health-gradient"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-health-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
