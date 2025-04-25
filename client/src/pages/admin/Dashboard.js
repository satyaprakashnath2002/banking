import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
  Alert
} from '@mui/material';
import { 
  AccountBalanceWallet as WalletIcon,
  SupervisedUserCircle as UserIcon,
  Payments as PaymentsIcon,
  AccountBalance as BankIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    recentCustomers: []
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if online
      if (!navigator.onLine) {
        setError('Your device appears to be offline. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // In a real application, you would fetch data from API
      // For now, we'll simulate API call
      try {
        // Optional: Try a quick ping to backend to ensure connection
        await apiClient.get('/admin/health', { timeout: 5000 });
        
        // Simulating API call with timeout
        setTimeout(() => {
          setStats({
            totalCustomers: 1254,
            totalAccounts: 1876,
            totalTransactions: 4589,
            recentCustomers: [
              { id: 1, name: 'John Doe', email: 'john.doe@example.com', date: '2023-04-15' },
              { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', date: '2023-04-14' },
              { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com', date: '2023-04-13' },
              { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', date: '2023-04-12' },
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (e) {
        console.error('Failed to connect to backend:', e);
        setError('Failed to connect to the server. Please try again later.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCustomerClick = (customerId) => {
    navigate(`/admin/customers/${customerId}`);
  };
  
  const retryLoading = () => {
    setError('');
    fetchDashboardData();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 8 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading admin dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={retryLoading} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 4 }}>
        Welcome back, {currentUser?.firstName || 'Admin'}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ minWidth: 275, bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Customers
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalCustomers}
                  </Typography>
                </Box>
                <UserIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ minWidth: 275, bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Accounts
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalAccounts}
                  </Typography>
                </Box>
                <BankIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ minWidth: 275, bgcolor: '#fff8e1' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Transactions
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalTransactions}
                  </Typography>
                </Box>
                <PaymentsIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ minWidth: 275, bgcolor: '#fce4ec' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    System Balance
                  </Typography>
                  <Typography variant="h4" component="div">
                    $2.4M
                  </Typography>
                </Box>
                <WalletIcon sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Customers
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {stats.recentCustomers.map((customer) => (
                <ListItem 
                  key={customer.id} 
                  button 
                  divider
                  onClick={() => handleCustomerClick(customer.id)}
                >
                  <ListItemText 
                    primary={customer.name} 
                    secondary={customer.email} 
                  />
                  <Typography variant="body2" color="textSecondary">
                    {customer.date}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => navigate('/admin/customers')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <UserIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1">
                      View Customers
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => navigate('/admin/transactions')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PaymentsIcon sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="subtitle1">
                      View Transactions
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => navigate('/admin/account-opening')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BankIcon sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="subtitle1">
                      Account Opening
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => navigate('/admin/profile')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <UserIcon sx={{ mr: 1, color: 'error.main' }} />
                    <Typography variant="subtitle1">
                      Admin Profile
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 