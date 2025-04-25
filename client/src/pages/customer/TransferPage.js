import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, TextField, Button, 
  Paper, Grid, MenuItem, FormControl, InputLabel, Select,
  CircularProgress, Divider, Alert
} from '@mui/material';
import { userService } from '../../services/userService';

const TransferPage = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    fromAccount: '',
    toType: 'beneficiary', // 'beneficiary' or 'account'
    toAccount: '',
    amount: '',
    description: '',
    transferType: 'immediate' // 'immediate' or 'scheduled'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user accounts
        const accountsData = await userService.getUserAccounts();
        setAccounts(accountsData || []);
        
        // Fetch beneficiaries
        const beneficiariesData = await userService.getBeneficiaries();
        setBeneficiaries(beneficiariesData || []);
        
        // Set default from account if available
        if (accountsData && accountsData.length > 0) {
          setFormData(prev => ({
            ...prev,
            fromAccount: accountsData[0].id
          }));
        }
      } catch (err) {
        setError('Failed to load accounts or beneficiaries');
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Reset to account when changing transfer type
    if (name === 'toType') {
      setFormData(prevData => ({
        ...prevData,
        toAccount: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate amount
      if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        setError('Please enter a valid amount');
        setLoading(false);
        return;
      }

      // Create transfer object
      const transferData = {
        fromAccountId: formData.fromAccount,
        amount: parseFloat(formData.amount),
        description: formData.description,
        transferType: formData.transferType
      };

      // Add destination info based on transfer type
      if (formData.toType === 'beneficiary') {
        transferData.beneficiaryId = formData.toAccount;
      } else {
        transferData.toAccountId = formData.toAccount;
      }

      // Assuming there's a method to process transfers in your userService
      await userService.initiateTransfer(transferData);
      setSuccess('Transfer initiated successfully');
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        toAccount: '',
        amount: '',
        description: ''
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process transfer');
    } finally {
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
          Transfer Money
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>From</Typography>
              <FormControl fullWidth required>
                <InputLabel>Source Account</InputLabel>
                <Select
                  name="fromAccount"
                  value={formData.fromAccount}
                  label="Source Account"
                  onChange={handleChange}
                >
                  {accounts.map(account => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.accountNumber} - {account.accountType} (Balance: ${account.balance})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>To</Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Transfer To</InputLabel>
                <Select
                  name="toType"
                  value={formData.toType}
                  label="Transfer To"
                  onChange={handleChange}
                >
                  <MenuItem value="beneficiary">Beneficiary</MenuItem>
                  <MenuItem value="account">My Other Account</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth required>
                <InputLabel>Destination</InputLabel>
                <Select
                  name="toAccount"
                  value={formData.toAccount}
                  label="Destination"
                  onChange={handleChange}
                >
                  {formData.toType === 'beneficiary' ? (
                    beneficiaries.map(beneficiary => (
                      <MenuItem key={beneficiary.id} value={beneficiary.id}>
                        {beneficiary.name} - {beneficiary.accountNumber} ({beneficiary.bankName})
                      </MenuItem>
                    ))
                  ) : (
                    accounts
                      .filter(account => account.id !== formData.fromAccount)
                      .map(account => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.accountNumber} - {account.accountType}
                        </MenuItem>
                      ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Details</Typography>
              
              <TextField
                required
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                value={formData.amount}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth>
                <InputLabel>Transfer Type</InputLabel>
                <Select
                  name="transferType"
                  value={formData.transferType}
                  label="Transfer Type"
                  onChange={handleChange}
                >
                  <MenuItem value="immediate">Immediate Transfer</MenuItem>
                  <MenuItem value="scheduled">Scheduled Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading || !formData.fromAccount || !formData.toAccount || !formData.amount}
              >
                {loading ? 'Processing...' : 'Transfer Money'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default TransferPage; 