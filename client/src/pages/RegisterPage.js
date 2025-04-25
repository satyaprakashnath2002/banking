import React, { useState } from 'react';
import { 
  Avatar, 
  Button, 
  TextField, 
  Link, 
  Grid, 
  Box, 
  Typography, 
  Container, 
  Paper,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authService from '../services/auth.service';
import { useTheme } from '../contexts/ThemeContext';

// Validation schemas for each step
const validationSchemas = [
  // Step 1: Personal Information
  Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required')
      .matches(/^[0-9]+$/, 'Phone number must contain only digits')
      .min(10, 'Phone number must be at least 10 digits')
  }),
  // Step 2: Address Information
  Yup.object({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip code is required')
      .matches(/^[0-9]+$/, 'Zip code must contain only digits')
  }),
  // Step 3: Password
  Yup.object({
    password: Yup.string().required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must be at least 8 characters with both letters and numbers'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  })
];

const steps = ['Personal Information', 'Address', 'Security'];

const RegisterPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { mode } = useTheme();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchemas[activeStep],
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (activeStep < steps.length - 1) {
        handleNext();
        return;
      }

      setIsSubmitting(true);
      setError('');

      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...userData } = values;
        
        await authService.register(userData);
        
        // Show success and redirect to login
        navigate('/login', { 
          state: { message: 'Registration successful! Please log in with your new account.' } 
        });
      } catch (err) {
        console.error('Registration error:', err);
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleNext = () => {
    formik.setTouched({});
    formik.validateForm().then(errors => {
      const currentStepErrors = Object.keys(errors).filter(key => {
        if (activeStep === 0) {
          return ['firstName', 'lastName', 'email', 'phoneNumber'].includes(key);
        } else if (activeStep === 1) {
          return ['address', 'city', 'state', 'zipCode'].includes(key);
        } else {
          return ['password', 'confirmPassword'].includes(key);
        }
      });

      if (currentStepErrors.length === 0) {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      }
    });
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  // Render form fields based on current step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  sx={mode === 'dark' ? darkModeStyles.textField : {}}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  sx={mode === 'dark' ? darkModeStyles.textField : {}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={mode === 'dark' ? darkModeStyles.textField : {}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  autoComplete="tel"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  sx={mode === 'dark' ? darkModeStyles.textField : {}}
                />
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  autoComplete="address-line1"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  sx={mode === 'dark' ? darkModeStyles.textField : {}}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                  sx={mode === 'dark' ? darkModeStyles.textField : {}}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="state"
                  label="State/Province"
                  name="state"
                  autoComplete="address-level1"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                  sx={mode === 'dark' ? darkModeStyles.textField : {}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="zipCode"
                  label="Zip / Postal code"
                  name="zipCode"
                  autoComplete="postal-code"
                  value={formik.values.zipCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                  helperText={formik.touched.zipCode && formik.errors.zipCode}
                  sx={mode === 'dark' ? darkModeStyles.textField : {}}
                />
              </Grid>
            </Grid>
          </>
        );
      case 2:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={
                    formik.touched.password && formik.errors.password
                      ? formik.errors.password
                      : "Password must be at least 8 characters with both letters and numbers"
                  }
                  sx={mode === 'dark' ? darkModeStyles.textField : {}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  sx={mode === 'dark' ? darkModeStyles.textField : {}}
                />
              </Grid>
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  // Dark mode specific styles
  const darkModeStyles = mode === 'dark' ? {
    paper: {
      background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    avatar: {
      background: 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.5)'
    },
    stepper: {
      '& .MuiStepIcon-root': {
        color: 'rgba(144, 202, 249, 0.5)',
        '&.Mui-active': {
          color: '#90caf9',
        },
        '&.Mui-completed': {
          color: '#64b5f6',
        }
      },
      '& .MuiStepLabel-label': {
        color: '#b0bec5',
        '&.Mui-active': {
          color: '#ffffff',
        },
        '&.Mui-completed': {
          color: '#90caf9',
        }
      }
    },
    textField: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
      }
    },
    button: {
      background: 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)',
      boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)'
    }
  } : {
    paper: {},
    avatar: {},
    stepper: {},
    textField: {},
    button: {}
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper 
        elevation={6} 
        sx={{ 
          mt: 8, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2,
          ...darkModeStyles.paper 
        }}
      >
        <Avatar sx={{ 
          m: 1, 
          bgcolor: 'primary.main',
          ...darkModeStyles.avatar
        }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" 
          sx={{ 
            fontWeight: mode === 'dark' ? 500 : 400,
            letterSpacing: mode === 'dark' ? '0.05em' : 'normal'
          }}
        >
          Create Account
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', mt: 3, ...darkModeStyles.stepper }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3, width: '100%' }}>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            {activeStep > 0 && (
              <Button 
                onClick={handleBack}
                sx={{ 
                  mr: 1,
                  ...(mode === 'dark' && {
                    color: '#90caf9',
                    borderColor: 'rgba(144, 202, 249, 0.5)',
                    '&:hover': {
                      borderColor: '#90caf9'
                    }
                  })
                }}
                variant="outlined"
              >
                Back
              </Button>
            )}
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                ...((activeStep === steps.length - 1 || mode === 'dark') && darkModeStyles.button)
              }}
            >
              {activeStep === steps.length - 1 ? (isSubmitting ? 'Creating Account...' : 'Create Account') : 'Next'}
            </Button>
          </Box>
        </Box>
        <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
          <Grid item>
            <Link 
              component={RouterLink} 
              to="/login" 
              variant="body2"
              sx={{
                color: mode === 'dark' ? '#90caf9' : undefined,
                textDecoration: mode === 'dark' ? 'none' : undefined,
                '&:hover': {
                  textDecoration: mode === 'dark' ? 'underline' : undefined
                }
              }}
            >
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default RegisterPage; 