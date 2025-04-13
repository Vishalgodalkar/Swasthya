
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, userType, phoneNumber } = req.body;

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
        qualifications,
        bio: bio || '',
        isVerified: false // New doctors need verification
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
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
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

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};
