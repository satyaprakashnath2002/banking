import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions,
  Button, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import accountService from '../../services/accountService';
import transactionService from '../../services/transaction.service';
import beneficiaryService from '../../services/beneficiaryService';
import { formatCurrency } from '../../utils/format';

const Dashboard = () => {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [networkError, setNetworkError] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [serviceStatus, setServiceStatus] = useState({ status: 'unknown' });

  // Check service health
  useEffect(() => {
    const checkServiceHealth = async () => {
      try {
        const response = await transactionService.checkServiceStatus();
        setServiceStatus({
          status: response.data.status,
          message: response.data.message
        });
        // Clear service down error if service is now up
        if (response.data.status === 'up') {
          setNetworkError('');
        }
      } catch (err) {
        console.error('Service health check failed:', err);
        setServiceStatus({
          status: 'down',
          message: 'Transaction service appears to be down. Some features may not work properly.'
        });
      }
    };

    // Initial check
    checkServiceHealth();
    
    // Set up periodic checks every 30 seconds
    const intervalId = setInterval(checkServiceHealth, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to retry loading data
  const retryLoading = () => {
    setLoading(true);
    setError('');
    setNetworkError('');
    
    // Re-trigger the dashboard data loading
    fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      setNetworkError('');

      // First check if we're online
      if (!navigator.onLine) {
        setNetworkError('Your device appears to be offline. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Check service health first
      try {
        const response = await transactionService.checkServiceStatus();
        setServiceStatus({
          status: response.data.status,
          message: response.data.message
        });
        // Clear service down error if service is now up
        if (response.data.status === 'up') {
          setNetworkError('');
        }
      } catch (err) {
        console.error('Service health check failed:', err);
        setServiceStatus({
          status: 'down',
          message: 'Transaction service appears to be down. Some features may not work properly.'
        });
      }

      // Get account details with retry
      try {
        const accountResponse = await accountService.getAccountDetails();
        setAccount(accountResponse.data);
      } catch (accErr) {
        console.error('Failed to fetch account details:', accErr);
        if (accErr.response && accErr.response.status === 404) {
          setError('Your account information could not be found. Please contact support.');
        } else if (!accErr.response) {
          setNetworkError('Network error. Please check your connection and try again.');
        } else {
          setError('Failed to load account details. Please try again later.');
        }
        setLoading(false);
        return; // Stop further loading if account details fail
      }

      // Get recent transactions with increased retry count
      try {
        const transactionsResponse = await transactionService.getCustomerTransactions(3);
        setTransactions(transactionsResponse.data.slice(0, 5)); // Get only the latest 5
      } catch (transErr) {
        console.error('Failed to fetch transactions:', transErr);
        // Don't fail the whole dashboard if just transactions fail
        if (transErr.request && !transErr.response) {
          setNetworkError('Network error when loading transactions. Some data may be missing.');
        }
      }

      // Get beneficiaries with error handling
      try {
        const beneficiariesResponse = await beneficiaryService.getBeneficiaries();
        setBeneficiaries(beneficiariesResponse.data);
      } catch (benErr) {
        console.error('Failed to fetch beneficiaries:', benErr);
        // Don't fail the whole dashboard if just beneficiaries fail
      }

    } catch (err) {
      let errorMessage = 'Failed to load dashboard data. Please try again later.';
      
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Your account information could not be found. Please contact support.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        setNetworkError('Network error. Please check your connection and try again.');
        errorMessage = '';
      }
      
      if (errorMessage) {
        setError(errorMessage);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowBalance = () => {
    setShowBalance(!showBalance);
  };

  // Function to get icon based on transaction type
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownwardIcon color="success" />;
      case 'withdrawal':
        return <ArrowUpwardIcon color="error" />;
      case 'transfer':
        return <ArrowForwardIcon color="primary" />;
      default:
        return <ReceiptIcon color="action" />;
    }
  };

  // Function to format transaction description
  const formatTransactionDescription = (transaction) => {
    switch (transaction.transactionType) {
      case 'deposit':
        return `Deposit - ${transaction.description || 'Deposit to account'}`;
      case 'withdrawal':
        return `Withdrawal - ${transaction.description || 'Withdrawal from account'}`;
      case 'transfer':
        if (transaction.fromAccount === account?.accountNumber) {
          return `Transfer to ${transaction.toAccount} - ${transaction.description || 'Transfer out'}`;
        } else {
          return `Transfer from ${transaction.fromAccount} - ${transaction.description || 'Transfer in'}`;
        }
      default:
        return transaction.description || 'Transaction';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading your dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={retryLoading} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {serviceStatus.status === 'down' && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={retryLoading}>
              Retry
            </Button>
          }
        >
          {serviceStatus.message}
        </Alert>
      )}
      
      {networkError && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={retryLoading}>
              Retry
            </Button>
          }
        >
          {networkError}
        </Alert>
      )}
      
      {error ? (
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={retryLoading}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Account Overview */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #5393ff 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                }}
              />
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography component="h2" variant="h6" color="inherit" gutterBottom>
                  Account Overview
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccountBalanceIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" color="inherit">
                    Account Number: {account?.accountNumber}
                  </Typography>
                </Box>
                <Typography component="p" variant="h4" color="inherit" sx={{ mb: 2 }}>
                  {showBalance ? formatCurrency(account?.balance) : '••••••••'}
                  <IconButton 
                    onClick={toggleShowBalance} 
                    size="small" 
                    sx={{ ml: 1, color: 'white' }}
                  >
                    {showBalance ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Typography>
                <Typography color="inherit" sx={{ opacity: 0.8, mb: 2 }}>
                  Account Type: {account?.accountType?.replace('_', ' ').toUpperCase()}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    component={RouterLink} 
                    to="/transactions"
                    size="small"
                    startIcon={<ReceiptIcon />}
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      }
                    }}
                  >
                    View Transactions
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    component={RouterLink} 
                    to="/transfer"
                    size="small"
                    startIcon={<ArrowForwardIcon />}
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      }
                    }}
                  >
                    Transfer Money
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
                <Button 
                  variant="outlined" 
                  component={RouterLink} 
                  to="/beneficiaries"
                  startIcon={<PeopleIcon />}
                  fullWidth
                >
                  Manage Beneficiaries
                </Button>
                <Button 
                  variant="outlined" 
                  component={RouterLink} 
                  to="/beneficiaries/add"
                  startIcon={<PeopleIcon />}
                  fullWidth
                >
                  Add Beneficiary
                </Button>
                <Button 
                  variant="outlined" 
                  component={RouterLink} 
                  to="/profile"
                  startIcon={<AccountBalanceIcon />}
                  fullWidth
                >
                  View Profile
                </Button>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to="/transfer"
                  color="primary"
                  startIcon={<ArrowForwardIcon />}
                  fullWidth
                >
                  New Transfer
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Transactions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography component="h2" variant="h6" color="primary">
                    Recent Transactions
                  </Typography>
                  <ReceiptIcon color="primary" />
                </Box>
                <Divider />
                {transactions.length > 0 ? (
                  <List>
                    {transactions.map((transaction) => (
                      <ListItem
                        key={transaction.id}
                        secondaryAction={
                          <Typography 
                            variant="body2" 
                            color={
                              transaction.transactionType === 'deposit' ? 'success.main' :
                              transaction.transactionType === 'withdrawal' ? 'error.main' :
                              transaction.fromAccount === account?.accountNumber ? 'error.main' : 'success.main'
                            }
                          >
                            {transaction.transactionType === 'deposit' || 
                             (transaction.transactionType === 'transfer' && transaction.toAccount === account?.accountNumber)
                              ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </Typography>
                        }
                      >
                        <ListItemIcon>
                          {getTransactionIcon(transaction.transactionType)}
                        </ListItemIcon>
                        <ListItemText
                          primary={formatTransactionDescription(transaction)}
                          secondary={new Date(transaction.createdAt).toLocaleDateString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography sx={{ my: 2, textAlign: 'center' }}>
                    No recent transactions found.
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={RouterLink} 
                  to="/transactions"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ ml: 'auto' }}
                >
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Recent Beneficiaries */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography component="h2" variant="h6" color="primary">
                    Your Beneficiaries
                  </Typography>
                  <PeopleIcon color="primary" />
                </Box>
                <Divider />
                {beneficiaries.length > 0 ? (
                  <List>
                    {beneficiaries.slice(0, 5).map((beneficiary) => (
                      <ListItem
                        key={beneficiary.id}
                        secondaryAction={
                          <Button 
                            size="small" 
                            variant="outlined"
                            component={RouterLink}
                            to={`/transfer?beneficiaryId=${beneficiary.id}`}
                          >
                            Transfer
                          </Button>
                        }
                      >
                        <ListItemIcon>
                          <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={beneficiary.name}
                          secondary={`${beneficiary.bankName} - ${beneficiary.accountNumber}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography sx={{ my: 2, textAlign: 'center' }}>
                    No beneficiaries found. Add a beneficiary to make transfers.
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={RouterLink} 
                  to="/beneficiaries"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ ml: 'auto' }}
                >
                  Manage Beneficiaries
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard; 