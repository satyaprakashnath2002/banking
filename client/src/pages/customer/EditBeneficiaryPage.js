import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, Typography, Box, TextField, Button, 
  Paper, Grid, MenuItem, FormControl, InputLabel, Select,
  CircularProgress
} from '@mui/material';
import { userService } from '../../services/userService';

const EditBeneficiaryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    bankName: '',
    accountType: 'savings',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchBeneficiary = async () => {
      try {
        // Assuming there's a method to get beneficiary by id in your userService
        const data = await userService.getBeneficiaryById(id);
        setFormData({
          name: data.name || '',
          accountNumber: data.accountNumber || '',
          bankName: data.bankName || '',
          accountType: data.accountType || 'savings',
          description: data.description || ''
        });
      } catch (err) {
        setError('Failed to load beneficiary details');
      } finally {
        setFetchingData(false);
      }
    };

    fetchBeneficiary();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await userService.updateBeneficiary(id, formData);
      // Ensure the navigation happens after successful API call
      setTimeout(() => {
        navigate('/beneficiaries', { replace: true });
      }, 100);
    } catch (err) {
      console.error('Error updating beneficiary:', err);
      setError(err.response?.data?.message || 'Failed to update beneficiary');
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Beneficiary
        </Typography>
        
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Beneficiary Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Bank Name"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  name="accountType"
                  value={formData.accountType}
                  label="Account Type"
                  onChange={handleChange}
                >
                  <MenuItem value="savings">Savings</MenuItem>
                  <MenuItem value="checking">Checking</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/beneficiaries')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Beneficiary'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditBeneficiaryPage; 