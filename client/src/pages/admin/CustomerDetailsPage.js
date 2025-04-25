import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ToggleOn as EnableIcon,
  ToggleOff as DisableIcon,
  AccountBalanceWallet as WalletIcon,
  Payments as PaymentsIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    // In a real application, you would fetch data from an API
    const fetchCustomerData = () => {
      // Simulating API call with timeout
      setTimeout(() => {
        const mockCustomer = {
          id: parseInt(id),
          firstName: 'John',
          lastName: 'Doe',
          email: `john.doe${id}@example.com`,
          phoneNumber: `555-${100 + parseInt(id)}`,
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          status: 'Active',
          dateCreated: new Date(2023, 0, 1).toLocaleDateString(),
          lastLogin: new Date(2023, 3, 1).toLocaleDateString()
        };
        
        const mockAccounts = [
          {
            id: 1,
            accountNumber: `1000${1000 + parseInt(id)}1`,
            accountType: 'Savings',
            balance: 5000.00,
            status: 'Active',
            dateCreated: new Date(2023, 0, 2).toLocaleDateString()
          },
          {
            id: 2,
            accountNumber: `1000${1000 + parseInt(id)}2`,
            accountType: 'Checking',
            balance: 2500.00,
            status: 'Active',
            dateCreated: new Date(2023, 0, 3).toLocaleDateString()
          }
        ];
        
        const mockTransactions = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          date: new Date(2023, 3, 10 - i).toLocaleDateString(),
          description: i % 2 === 0 ? 'Deposit' : 'Withdrawal',
          amount: i % 2 === 0 ? 500 : -200,
          balance: 5000 - (i * 200),
          accountNumber: mockAccounts[i % 2].accountNumber
        }));
        
        setCustomer(mockCustomer);
        setAccounts(mockAccounts);
        setTransactions(mockTransactions);
        setFormData({
          firstName: mockCustomer.firstName,
          lastName: mockCustomer.lastName,
          email: mockCustomer.email,
          phoneNumber: mockCustomer.phoneNumber,
          address: mockCustomer.address,
          city: mockCustomer.city,
          state: mockCustomer.state,
          zipCode: mockCustomer.zipCode,
          country: mockCustomer.country
        });
        setLoading(false);
      }, 1000);
    };

    fetchCustomerData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBackClick = () => {
    navigate('/admin/customers');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode,
      country: customer.country
    });
    setEditMode(false);
  };

  const handleSaveClick = () => {
    // In a real application, you would send the updated data to your API
    setCustomer(prevCustomer => ({
      ...prevCustomer,
      ...formData
    }));
    setEditMode(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleToggleStatus = () => {
    // In a real application, you would update the user status via API
    setCustomer(prevCustomer => ({
      ...prevCustomer,
      status: prevCustomer.status === 'Active' ? 'Inactive' : 'Active'
    }));
  };

  const handleAddAccount = () => {
    // In a real application, you would redirect to account creation or open a dialog
    navigate('/admin/account-opening', { state: { customerId: id } });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={handleBackClick}
          sx={{ mr: 2 }}
        >
          Back to Customers
        </Button>
        <Typography variant="h4">
          Customer Details
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5">
              {customer.firstName} {customer.lastName}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Customer ID: {customer.id}
            </Typography>
          </Box>
          <Box>
            <Chip 
              label={customer.status} 
              color={customer.status === 'Active' ? 'success' : 'default'}
              sx={{ mr: 1 }}
            />
            <Button
              variant="outlined"
              startIcon={customer.status === 'Active' ? <DisableIcon /> : <EnableIcon />}
              onClick={handleToggleStatus}
              sx={{ mr: 1 }}
            >
              {customer.status === 'Active' ? 'Disable' : 'Enable'}
            </Button>
            {editMode ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveClick}
                >
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="customer tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Profile" />
          <Tab label="Accounts" />
          <Tab label="Transactions" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!editMode}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Zip Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    disabled={!editMode}
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Customer Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Date Created" secondary={customer.dateCreated} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Last Login" secondary={customer.lastLogin} />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Customer Accounts
            </Typography>
            <Button
              variant="contained"
              startIcon={<WalletIcon />}
              onClick={handleAddAccount}
            >
              Add Account
            </Button>
          </Box>

          <Grid container spacing={3}>
            {accounts.map((account) => (
              <Grid item xs={12} md={6} key={account.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {account.accountType} Account
                      </Typography>
                      <Chip 
                        label={account.status} 
                        color={account.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Account Number: {account.accountNumber}
                    </Typography>
                    <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                      ${account.balance.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Opened on {account.dateCreated}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        size="small" 
                        startIcon={<PaymentsIcon />}
                        onClick={() => navigate(`/admin/transactions?accountNumber=${account.accountNumber}`)}
                      >
                        View Transactions
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Recent Transactions
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.accountNumber}</TableCell>
                    <TableCell align="right" sx={{ 
                      color: transaction.amount > 0 ? 'success.main' : 'error.main',
                      fontWeight: 'medium' 
                    }}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">{transaction.balance.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/transactions', { state: { customerId: id } })}
            >
              View All Transactions
            </Button>
          </Box>
        </TabPanel>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Change Customer Status</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {customer.status === 'Active' ? 'disable' : 'enable'} this customer?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {customer.status === 'Active' 
              ? 'Disabling will prevent the customer from logging in and using their accounts.' 
              : 'Enabling will allow the customer to access their accounts again.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color={customer.status === 'Active' ? 'error' : 'success'}
            onClick={() => {
              handleToggleStatus();
              handleCloseDialog();
            }}
          >
            {customer.status === 'Active' ? 'Disable' : 'Enable'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerDetailsPage; 