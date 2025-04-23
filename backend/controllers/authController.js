
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, userType, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('Email already registered', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      userType,
      phoneNumber
    });

    // If registering as a doctor, create doctor profile
    if (userType === 'doctor') {
      const { 
        specialization, 
        experience, 
        licenseNumber, 
        licenseAuthority,
        consultationFee,
        qualifications,
        bio 
      } = req.body;

      await Doctor.create({
        user: user._id,
        specialization,
        experience,
        licenseNumber,
        licenseAuthority,
        consultationFee,
        qualifications: qualifications || [],
        bio: bio || '',
        isVerified: false // New doctors need verification
      });
    }
    
    // If registering as a patient, create patient profile
    if (userType === 'patient') {
      const {
        dateOfBirth,
        gender,
        bloodType,
        allergies,
        medicalHistory
      } = req.body;
      
      await Patient.create({
        user: user._id,
        dateOfBirth,
        gender,
        bloodType,
        allergies: allergies || [],
        medicalHistory: medicalHistory || []
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for demo doctor login
    if (email === 'dr.smith@example.com' && password === 'password123') {
      // Check if demo doctor already exists
      let user = await User.findOne({ email: 'dr.smith@example.com' });
      
      if (!user) {
        // Create demo doctor user
        user = await User.create({
          name: 'Dr. Sarah Smith',
          email: 'dr.smith@example.com',
          password: 'password123', // Will be hashed by the model pre-save hook
          userType: 'doctor',
          phoneNumber: '555-123-4567',
          profileImage: 'default-profile.jpg'
        });
        
        // Create demo doctor profile
        await Doctor.create({
          user: user._id,
          specialization: 'Cardiology',
          qualifications: [
            {
              degree: 'MD',
              institution: 'Harvard Medical School',
              year: 2010
            },
            {
              degree: 'PhD',
              institution: 'Johns Hopkins University',
              year: 2012
            }
          ],
          experience: 12,
          licenseNumber: 'MD12345678',
          licenseAuthority: 'American Medical Association',
          licenseDocumentUrl: 'https://example.com/uploads/license.pdf',
          certificateDocumentUrl: 'https://example.com/uploads/certificate.pdf',
          isVerified: true,
          consultationFee: 150,
          bio: 'Board-certified cardiologist with over 12 years of experience in treating heart conditions and performing cardiac procedures.',
          availableSlots: [
            {
              day: 'Monday',
              startTime: '09:00',
              endTime: '17:00'
            },
            {
              day: 'Wednesday',
              startTime: '09:00',
              endTime: '17:00'
            },
            {
              day: 'Friday',
              startTime: '09:00',
              endTime: '13:00'
            }
          ]
        });
      }

      return sendTokenResponse(user, 200, res);
    }

    // Check for demo patient login
    if (email === 'john@example.com' && password === 'password123') {
      // Check if demo user already exists
      let user = await User.findOne({ email: 'john@example.com' });
      
      if (!user) {
        // Create demo user
        user = await User.create({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123', // Will be hashed by the model pre-save hook
          userType: 'patient',
          phoneNumber: '555-987-6543',
          profileImage: 'default-profile.jpg'
        });
        
        // Create patient profile with demo data
        await Patient.create({
          user: user._id,
          dateOfBirth: new Date('1985-05-15'),
          gender: 'Male',
          bloodType: 'A+',
          allergies: ['Peanuts', 'Penicillin'],
          medicalHistory: [
            {
              condition: 'Asthma',
              diagnosedDate: new Date('2005-03-10'),
              treatment: 'Inhaler as needed',
              notes: 'Mild condition, triggered by pollen and exercise'
            }
          ],
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phoneNumber: '555-123-7890'
          }
        });
      }

      return sendTokenResponse(user, 200, res);
    }

    // Regular login flow
    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Get additional profile information based on user type
    let profileData = {};
    
    if (user.userType === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: user._id });
      if (doctorProfile) {
        profileData = doctorProfile.toObject();
      }
    } else if (user.userType === 'patient') {
      const patientProfile = await Patient.findOne({ user: user._id });
      if (patientProfile) {
        profileData = patientProfile.toObject();
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        ...profileData,
        id: user._id // Ensure ID is provided for frontend
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorResponse('Please provide an email address', 400));
    }

    const user = await User.findOne({ email });

    // Don't reveal if user exists, just return success
    // In a real application, this would send an email with reset instructions
    
    res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent'
    });
  } catch (err) {
    next(err);
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Remove password from output
  user.password = undefined;

  // Convert mongoose document to plain object to add id field
  const userObject = user.toObject ? user.toObject() : { ...user };
  
  // Add id field that matches the frontend User interface
  userObject.id = userObject._id.toString();
  delete userObject._id;
  delete userObject.__v;

  res.status(statusCode).json({
    success: true,
    token,
    user: userObject
  });
};
