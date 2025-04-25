import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  FormHelperText,
  Alert,
  CircularProgress,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Card,
  CardContent,
  Autocomplete
} from '@mui/material';
import {
  Person as PersonIcon,
  AccountBalance as AccountIcon,
  ContentPaste as DocumentIcon,
  Check as ConfirmIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const steps = ['Customer Information', 'Account Details', 'Document Verification', 'Confirmation'];

const AccountOpeningPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [existingCustomers, setExistingCustomers] = useState([]);
  const [isExistingCustomer, setIsExistingCustomer] = useState('new');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    // Customer Information
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    socialSecurityNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    
    // Account Details
    accountType: 'savings',
    initialDeposit: '',
    currency: 'USD',
    interestRate: '0.75',
    hasDebitCard: true,
    hasCheckbook: false,
    
    // Document Verification
    idType: 'passport',
    idNumber: '',
    idExpiryDate: '',
    idDocumentFile: null,
    addressProofFile: null,
    
    // Additional fields
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If we have a customer ID from state, prefill the customer information
    if (location.state?.customerId) {
      setIsExistingCustomer('existing');
      // In a real app, you would fetch customer data based on the ID
      // For now, we'll use mock data
      const mockCustomer = {
        id: location.state.customerId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '555-123-4567',
        dateOfBirth: '1980-01-01',
        socialSecurityNumber: 'XXX-XX-XXXX',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      };
      
      setSelectedCustomer(mockCustomer);
      setFormData(prev => ({
        ...prev,
        firstName: mockCustomer.firstName,
        lastName: mockCustomer.lastName,
        email: mockCustomer.email,
        phoneNumber: mockCustomer.phoneNumber,
        dateOfBirth: mockCustomer.dateOfBirth,
        socialSecurityNumber: mockCustomer.socialSecurityNumber,
        address: mockCustomer.address,
        city: mockCustomer.city,
        state: mockCustomer.state,
        zipCode: mockCustomer.zipCode,
        country: mockCustomer.country
      }));
    }
    
    // Fetch existing customers (mock data)
    setExistingCustomers([
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com' },
      { id: 4, name: 'Emily Davis', email: 'emily.d@example.com' },
    ]);
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCustomerTypeChange = (e) => {
    setIsExistingCustomer(e.target.value);
    if (e.target.value === 'new') {
      setSelectedCustomer(null);
    }
  };

  const handleCustomerSelect = (event, value) => {
    setSelectedCustomer(value);
    if (value) {
      // In a real app, you would fetch detailed customer data
      // For now, we'll use the mock data
      setFormData(prev => ({
        ...prev,
        firstName: value.name.split(' ')[0],
        lastName: value.name.split(' ')[1],
        email: value.email,
        // Other fields would be filled with actual customer data
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      
      // Clear error when field is updated
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      // Validate customer information
      if (isExistingCustomer === 'existing' && !selectedCustomer) {
        newErrors.selectedCustomer = 'Please select a customer';
      } else if (isExistingCustomer === 'new') {
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.socialSecurityNumber) newErrors.socialSecurityNumber = 'SSN is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.zipCode) newErrors.zipCode = 'Zip code is required';
      }
    } else if (activeStep === 1) {
      // Validate account details
      if (!formData.accountType) newErrors.accountType = 'Account type is required';
      if (!formData.initialDeposit) newErrors.initialDeposit = 'Initial deposit is required';
      else if (isNaN(formData.initialDeposit) || parseFloat(formData.initialDeposit) < 100) {
        newErrors.initialDeposit = 'Initial deposit must be at least $100';
      }
    } else if (activeStep === 2) {
      // Validate document verification
      if (!formData.idType) newErrors.idType = 'ID type is required';
      if (!formData.idNumber) newErrors.idNumber = 'ID number is required';
      if (!formData.idExpiryDate) newErrors.idExpiryDate = 'ID expiry date is required';
      if (!formData.idDocumentFile) newErrors.idDocumentFile = 'ID document is required';
      if (!formData.addressProofFile) newErrors.addressProofFile = 'Address proof is required';
    } else if (activeStep === 3) {
      // Validate confirmation
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    setLoading(true);
    
    // In a real application, you would send data to your API
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // After 2 seconds, redirect to customers list
      setTimeout(() => {
        navigate('/admin/customers');
      }, 2000);
    }, 1500);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Customer Type</FormLabel>
              <RadioGroup
                row
                name="customerType"
                value={isExistingCustomer}
                onChange={handleCustomerTypeChange}
              >
                <FormControlLabel value="new" control={<Radio />} label="New Customer" />
                <FormControlLabel value="existing" control={<Radio />} label="Existing Customer" />
              </RadioGroup>
            </FormControl>
            
            {isExistingCustomer === 'existing' ? (
              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  options={existingCustomers}
                  getOptionLabel={(option) => `${option.name} (${option.email})`}
                  value={selectedCustomer}
                  onChange={handleCustomerSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Customer"
                      error={!!errors.selectedCustomer}
                      helperText={errors.selectedCustomer}
                      fullWidth
                    />
                  )}
                />
                
                {selectedCustomer && (
                  <Card sx={{ mt: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Customer Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Name: {formData.firstName} {formData.lastName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Email: {formData.email}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Social Security Number"
                    name="socialSecurityNumber"
                    value={formData.socialSecurityNumber}
                    onChange={handleChange}
                    error={!!errors.socialSecurityNumber}
                    helperText={errors.socialSecurityNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={!!errors.city}
                    helperText={errors.city}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    error={!!errors.state}
                    helperText={errors.state}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Zip Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      label="Country"
                    >
                      <MenuItem value="USA">United States</MenuItem>
                      <MenuItem value="CAN">Canada</MenuItem>
                      <MenuItem value="GBR">United Kingdom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Account Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.accountType}>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    label="Account Type"
                  >
                    <MenuItem value="savings">Savings Account</MenuItem>
                    <MenuItem value="checking">Checking Account</MenuItem>
                    <MenuItem value="moneyMarket">Money Market Account</MenuItem>
                    <MenuItem value="timeDeposit">Certificate of Deposit</MenuItem>
                  </Select>
                  {errors.accountType && <FormHelperText>{errors.accountType}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Initial Deposit ($)"
                  name="initialDeposit"
                  type="number"
                  value={formData.initialDeposit}
                  onChange={handleChange}
                  error={!!errors.initialDeposit}
                  helperText={errors.initialDeposit}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    label="Currency"
                  >
                    <MenuItem value="USD">USD - US Dollar</MenuItem>
                    <MenuItem value="EUR">EUR - Euro</MenuItem>
                    <MenuItem value="GBP">GBP - British Pound</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Interest Rate (%)"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  disabled={formData.accountType === 'checking'}
                  InputProps={{
                    readOnly: formData.accountType === 'checking',
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Additional Services
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.hasDebitCard}
                      onChange={() => setFormData(prev => ({ ...prev, hasDebitCard: true }))}
                    />
                  }
                  label="Issue Debit Card"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={!formData.hasDebitCard}
                      onChange={() => setFormData(prev => ({ ...prev, hasDebitCard: false }))}
                    />
                  }
                  label="No Debit Card"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.hasCheckbook}
                      onChange={() => setFormData(prev => ({ ...prev, hasCheckbook: true }))}
                      disabled={formData.accountType !== 'checking'}
                    />
                  }
                  label="Issue Checkbook"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={!formData.hasCheckbook}
                      onChange={() => setFormData(prev => ({ ...prev, hasCheckbook: false }))}
                      disabled={formData.accountType !== 'checking'}
                    />
                  }
                  label="No Checkbook"
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Document Verification
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.idType}>
                  <InputLabel>ID Type</InputLabel>
                  <Select
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                    label="ID Type"
                  >
                    <MenuItem value="passport">Passport</MenuItem>
                    <MenuItem value="driverLicense">Driver's License</MenuItem>
                    <MenuItem value="stateId">State ID</MenuItem>
                  </Select>
                  {errors.idType && <FormHelperText>{errors.idType}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID Number"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  error={!!errors.idNumber}
                  helperText={errors.idNumber}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID Expiry Date"
                  name="idExpiryDate"
                  type="date"
                  value={formData.idExpiryDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.idExpiryDate}
                  helperText={errors.idExpiryDate}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Upload Documents
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <input
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  id="id-document-file"
                  type="file"
                  name="idDocumentFile"
                  onChange={handleFileChange}
                />
                <label htmlFor="id-document-file">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<DocumentIcon />}
                  >
                    Upload ID Document
                  </Button>
                </label>
                {formData.idDocumentFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {formData.idDocumentFile.name}
                  </Typography>
                )}
                {errors.idDocumentFile && (
                  <FormHelperText error>{errors.idDocumentFile}</FormHelperText>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <input
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  id="address-proof-file"
                  type="file"
                  name="addressProofFile"
                  onChange={handleFileChange}
                />
                <label htmlFor="address-proof-file">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<DocumentIcon />}
                  >
                    Upload Address Proof
                  </Button>
                </label>
                {formData.addressProofFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {formData.addressProofFile.name}
                  </Typography>
                )}
                {errors.addressProofFile && (
                  <FormHelperText error>{errors.addressProofFile}</FormHelperText>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  For ID verification, please upload a clear scan or photo of your ID document.
                  For address proof, you can upload a utility bill, bank statement, or government-issued document
                  dated within the last 3 months.
                </Alert>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Account Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Customer Information
                    </Typography>
                    <Typography variant="body2">
                      <strong>Name:</strong> {formData.firstName} {formData.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {formData.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {formData.phoneNumber}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      <AccountIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Account Details
                    </Typography>
                    <Typography variant="body2">
                      <strong>Account Type:</strong> {formData.accountType.charAt(0).toUpperCase() + formData.accountType.slice(1)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Initial Deposit:</strong> ${formData.initialDeposit} {formData.currency}
                    </Typography>
                    {formData.accountType !== 'checking' && (
                      <Typography variant="body2">
                        <strong>Interest Rate:</strong> {formData.interestRate}%
                      </Typography>
                    )}
                    <Typography variant="body2">
                      <strong>Debit Card:</strong> {formData.hasDebitCard ? 'Yes' : 'No'}
                    </Typography>
                    {formData.accountType === 'checking' && (
                      <Typography variant="body2">
                        <strong>Checkbook:</strong> {formData.hasCheckbook ? 'Yes' : 'No'}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.termsAccepted}
                      onChange={() => setFormData(prev => ({ ...prev, termsAccepted: !prev.termsAccepted }))}
                    />
                  }
                  label="I confirm that all information provided is accurate and complete. I agree to the terms and conditions."
                />
                {errors.termsAccepted && (
                  <FormHelperText error>{errors.termsAccepted}</FormHelperText>
                )}
              </Grid>
            </Grid>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Opening
      </Typography>

      {success ? (
        <Alert severity="success" sx={{ mt: 2 }}>
          Account has been successfully created! Redirecting to customers list...
        </Alert>
      ) : (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              startIcon={activeStep === steps.length - 1 ? <ConfirmIcon /> : null}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : activeStep === steps.length - 1 ? (
                'Create Account'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AccountOpeningPage; 