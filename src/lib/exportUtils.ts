
/**
 * Utility functions for handling file exports and downloads
 */

export interface HealthDataExport {
  profile: {
    name: string;
    dateOfBirth: string;
    bloodType: string;
    height: number;
    weight: number;
  };
  medicalHistory: {
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
    surgeries: {
      procedure: string;
      date: string;
      hospital: string;
    }[];
  };
  vitalSigns: {
    date: string;
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
  }[];
  appointments: {
    doctorName: string;
    date: string;
    type: string;
    notes: string;
  }[];
  reports: {
    title: string;
    date: string;
    doctor: string;
    reportType: string;
    summary: string;
  }[];
}

/**
 * Download a blob as a file
 * @param blob The blob to download
 * @param fileName The name to give the file
 */
export const downloadBlob = (blob: Blob, fileName: string): void => {
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Append the link to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

/**
 * Convert health data to different formats and download
 * @param data The health data to export
 * @param format The format to export to ('json', 'csv', or 'pdf')
 * @param fileName Optional filename (without extension)
 */
export const exportHealthData = (
  data: HealthDataExport, 
  format: 'json' | 'csv' | 'pdf' = 'json',
  fileName: string = 'health-data-export'
): void => {
  try {
    let blob: Blob;
    let fullFileName: string;
    
    switch (format) {
      case 'json':
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        fullFileName = `${fileName}.json`;
        break;
        
      case 'csv':
        // Basic CSV conversion - in a real app you'd use a more robust CSV library
        const csvContent = [
          // Header
          'Category,Key,Value',
          // Profile data
          ...Object.entries(data.profile).map(([key, value]) => `Profile,${key},${value}`),
          // Allergies
          ...(data.medicalHistory.allergies || []).map(item => `Allergies,item,${item}`),
          // Medications
          ...(data.medicalHistory.medications || []).map(item => `Medications,item,${item}`),
          // Chronic conditions
          ...(data.medicalHistory.chronicConditions || []).map(item => `ChronicConditions,item,${item}`),
        ].join('\n');
        
        blob = new Blob([csvContent], { type: 'text/csv' });
        fullFileName = `${fileName}.csv`;
        break;
        
      case 'pdf':
        // In a real app, you would generate a PDF using a library like pdfmake
        // For now, we'll just simulate it with an HTML blob
        const htmlContent = `
          <html>
            <head>
              <title>Health Data Export</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #333366; }
                h2 { color: #666699; margin-top: 20px; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h1>Health Data Export</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
              
              <h2>Profile Information</h2>
              <table>
                <tr><th>Name</th><td>${data.profile.name}</td></tr>
                <tr><th>Date of Birth</th><td>${data.profile.dateOfBirth}</td></tr>
                <tr><th>Blood Type</th><td>${data.profile.bloodType}</td></tr>
                <tr><th>Height</th><td>${data.profile.height} cm</td></tr>
                <tr><th>Weight</th><td>${data.profile.weight} kg</td></tr>
              </table>
              
              <h2>Medical History</h2>
              <h3>Allergies</h3>
              <ul>
                ${data.medicalHistory.allergies.map(item => `<li>${item}</li>`).join('')}
              </ul>
              
              <h3>Chronic Conditions</h3>
              <ul>
                ${data.medicalHistory.chronicConditions.map(item => `<li>${item}</li>`).join('')}
              </ul>
              
              <h3>Medications</h3>
              <ul>
                ${data.medicalHistory.medications.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </body>
          </html>
        `;
        
        blob = new Blob([htmlContent], { type: 'text/html' });
        fullFileName = `${fileName}.html`;
        // Note: In a real app, you would convert this to PDF
        break;
        
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    downloadBlob(blob, fullFileName);
    return true;
  } catch (error) {
    console.error('Error exporting health data:', error);
    throw error;
  }
};

/**
 * Format a file size in bytes to a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
};

/**
 * Validate file type and size
 * @param file The file to validate
 * @param allowedTypes Array of allowed MIME types
 * @param maxSizeInMB Maximum file size in MB
 */
export const validateFile = (
  file: File,
  allowedTypes: string[] = [],
  maxSizeInMB: number = 10
): { valid: boolean; message?: string } => {
  // Check file size
  if (file.size > maxSizeInMB * 1024 * 1024) {
    return {
      valid: false,
      message: `File is too large. Maximum size is ${maxSizeInMB} MB.`
    };
  }
  
  // Check file type if types are specified
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  return { valid: true };
};
