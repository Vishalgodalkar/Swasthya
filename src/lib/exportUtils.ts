
export interface ExportOptions {
  format: 'pdf' | 'json' | 'csv';
  includePersonalInfo: boolean;
  includeHealthRecords: boolean;
  includePrescriptions: boolean;
  includeAppointments: boolean;
}

export const exportPatientData = async (
  patientId: string, 
  options: ExportOptions
): Promise<void> => {
  try {
    // Simulating API call to export patient data
    console.log(`Exporting data for patient ${patientId} with options:`, options);
    
    // In a real app, this would make an API call to generate and download the file
    const mockData = generateMockPatientData(options);
    
    // Create a blob and trigger download based on the format
    let blob: Blob;
    let fileName: string;
    
    switch (options.format) {
      case 'pdf':
        blob = new Blob([mockData.toString()], { type: 'application/pdf' });
        fileName = `patient-data-${patientId}.pdf`;
        break;
      case 'csv':
        blob = new Blob([convertToCSV(mockData)], { type: 'text/csv' });
        fileName = `patient-data-${patientId}.csv`;
        break;
      case 'json':
      default:
        blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
        fileName = `patient-data-${patientId}.json`;
        break;
    }
    
    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Clean up the URL object after download
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);

  } catch (error) {
    console.error('Error exporting patient data:', error);
    throw error;
  }
};

// Mock function to generate patient data for export
function generateMockPatientData(options: ExportOptions) {
  const mockData: any = {};
  
  if (options.includePersonalInfo) {
    mockData.personalInfo = {
      name: 'John Doe',
      email: 'john@example.com',
      dateOfBirth: '1985-05-15',
      bloodType: 'A+',
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '555-123-4567'
      }
    };
  }
  
  if (options.includeHealthRecords) {
    mockData.healthRecords = [
      {
        date: '2023-01-15',
        doctor: 'Dr. Sarah Smith',
        diagnosis: 'Common Cold',
        treatment: 'Rest, fluids, and over-the-counter medication',
        notes: 'Patient advised to rest for 3 days'
      },
      {
        date: '2023-03-22',
        doctor: 'Dr. Robert Johnson',
        diagnosis: 'Sprained Ankle',
        treatment: 'RICE method, prescribed pain relievers',
        notes: 'Follow-up in 2 weeks'
      }
    ];
  }
  
  if (options.includePrescriptions) {
    mockData.prescriptions = [
      {
        date: '2023-01-15',
        medication: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '7 days',
        prescribedBy: 'Dr. Sarah Smith'
      },
      {
        date: '2023-03-22',
        medication: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Every 6 hours as needed',
        duration: '5 days',
        prescribedBy: 'Dr. Robert Johnson'
      }
    ];
  }
  
  if (options.includeAppointments) {
    mockData.appointments = [
      {
        date: '2023-01-15',
        time: '10:00 AM',
        doctor: 'Dr. Sarah Smith',
        reason: 'Cold symptoms',
        status: 'Completed'
      },
      {
        date: '2023-03-22',
        time: '2:30 PM',
        doctor: 'Dr. Robert Johnson',
        reason: 'Ankle injury',
        status: 'Completed'
      },
      {
        date: '2023-05-10',
        time: '11:15 AM',
        doctor: 'Dr. Sarah Smith',
        reason: 'Annual checkup',
        status: 'Scheduled'
      }
    ];
  }
  
  return mockData;
}

// Helper function to convert JSON data to CSV format
function convertToCSV(data: any): string {
  if (!data || Object.keys(data).length === 0) {
    return '';
  }
  
  let csv = '';
  
  // Handle personal info
  if (data.personalInfo) {
    csv += 'PERSONAL INFORMATION\n';
    for (const [key, value] of Object.entries(data.personalInfo)) {
      if (key !== 'emergencyContact') {
        csv += `${key},${value}\n`;
      }
    }
    if (data.personalInfo.emergencyContact) {
      csv += 'EMERGENCY CONTACT\n';
      for (const [key, value] of Object.entries(data.personalInfo.emergencyContact)) {
        csv += `${key},${value}\n`;
      }
    }
    csv += '\n';
  }
  
  // Handle health records
  if (data.healthRecords && data.healthRecords.length) {
    csv += 'HEALTH RECORDS\n';
    const headers = Object.keys(data.healthRecords[0]).join(',');
    csv += headers + '\n';
    data.healthRecords.forEach((record: any) => {
      csv += Object.values(record).join(',') + '\n';
    });
    csv += '\n';
  }
  
  // Handle prescriptions
  if (data.prescriptions && data.prescriptions.length) {
    csv += 'PRESCRIPTIONS\n';
    const headers = Object.keys(data.prescriptions[0]).join(',');
    csv += headers + '\n';
    data.prescriptions.forEach((prescription: any) => {
      csv += Object.values(prescription).join(',') + '\n';
    });
    csv += '\n';
  }
  
  // Handle appointments
  if (data.appointments && data.appointments.length) {
    csv += 'APPOINTMENTS\n';
    const headers = Object.keys(data.appointments[0]).join(',');
    csv += headers + '\n';
    data.appointments.forEach((appointment: any) => {
      csv += Object.values(appointment).join(',') + '\n';
    });
  }
  
  return csv;
}
