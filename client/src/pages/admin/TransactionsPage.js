import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const TransactionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    startDate: null,
    endDate: null,
    accountNumber: '',
    transactionType: '',
    amount: {
      min: '',
      max: ''
    }
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Get accountNumber from query params or location state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accountNumberParam = params.get('accountNumber');
    
    if (accountNumberParam) {
      setFilters(prev => ({
        ...prev,
        accountNumber: accountNumberParam
      }));
    } else if (location.state?.customerId) {
      // If there's a customer ID in the state, we could filter by customer
      // This would require a different API call in a real application
    }
  }, [location]);

  useEffect(() => {
    // In a real application, you would fetch data from an API with filters
    const fetchTransactions = () => {
      // Simulating API call with timeout
      setTimeout(() => {
        // Generate mock transactions
        const mockTransactions = Array.from({ length: 100 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          const isDeposit = i % 3 === 0;
          const isTransfer = i % 5 === 0;
          const isPayment = !isDeposit && !isTransfer;
          
          let type = '';
          if (isDeposit) type = 'Deposit';
          if (isTransfer) type = 'Transfer';
          if (isPayment) type = 'Payment';
          
          const amount = isDeposit ? 
            Math.floor(Math.random() * 5000) + 100 : 
            -1 * (Math.floor(Math.random() * 1000) + 50);
            
          return {
            id: i + 1,
            date: date.toISOString().split('T')[0],
            description: `${type} - Transaction #${1000 + i}`,
            accountNumber: `1000${1000 + (i % 10)}`,
            customerName: `Customer ${(i % 20) + 1}`,
            type,
            amount,
            status: i % 10 === 0 ? 'Pending' : 'Completed'
          };
        });
        
        setTransactions(mockTransactions);
        setLoading(false);
      }, 1000);
    };

    fetchTransactions();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(0);
  };

  const handleAmountFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      amount: {
        ...prev.amount,
        [field]: value
      }
    }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      startDate: null,
      endDate: null,
      accountNumber: '',
      transactionType: '',
      amount: {
        min: '',
        max: ''
      }
    });
    
    // Also clear URL params
    navigate('/admin/transactions');
  };

  const applyFilters = () => {
    // This function would be used to trigger API calls with filters in a real app
    console.log('Applying filters:', filters);
  };

  // Apply filters to the transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    if (filters.search && 
        !transaction.description.toLowerCase().includes(filters.search.toLowerCase()) && 
        !transaction.accountNumber.includes(filters.search) &&
        !transaction.customerName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Date range filter
    if (filters.startDate && new Date(transaction.date) < filters.startDate) {
      return false;
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59);
      if (new Date(transaction.date) > endDate) {
        return false;
      }
    }
    
    // Account number filter
    if (filters.accountNumber && transaction.accountNumber !== filters.accountNumber) {
      return false;
    }
    
    // Transaction type filter
    if (filters.transactionType && transaction.type !== filters.transactionType) {
      return false;
    }
    
    // Amount range filter
    if (filters.amount.min && transaction.amount < parseFloat(filters.amount.min)) {
      return false;
    }
    
    if (filters.amount.max && transaction.amount > parseFloat(filters.amount.max)) {
      return false;
    }
    
    return true;
  });

  const displayedTransactions = filteredTransactions
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transaction Management
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              sx={{ width: '60%' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ mr: 1 }}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                disabled={!filters.search && 
                         !filters.startDate && 
                         !filters.endDate && 
                         !filters.accountNumber &&
                         !filters.transactionType &&
                         !filters.amount.min &&
                         !filters.amount.max}
              >
                Clear Filters
              </Button>
            </Box>
          </Box>

          {showFilters && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label="Start Date"
                    value={filters.startDate}
                    onChange={(date) => handleFilterChange('startDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    maxDate={filters.endDate || undefined}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label="End Date"
                    value={filters.endDate}
                    onChange={(date) => handleFilterChange('endDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    minDate={filters.startDate || undefined}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    value={filters.accountNumber}
                    onChange={(e) => handleFilterChange('accountNumber', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Transaction Type</InputLabel>
                    <Select
                      value={filters.transactionType}
                      label="Transaction Type"
                      onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="Deposit">Deposit</MenuItem>
                      <MenuItem value="Transfer">Transfer</MenuItem>
                      <MenuItem value="Payment">Payment</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Min Amount"
                    type="number"
                    value={filters.amount.min}
                    onChange={(e) => handleAmountFilterChange('min', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Max Amount"
                    type="number"
                    value={filters.amount.max}
                    onChange={(e) => handleAmountFilterChange('max', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Button 
                    variant="contained"
                    onClick={applyFilters}
                    fullWidth
                    sx={{ height: '100%' }}
                  >
                    Apply Filters
                  </Button>
                </Grid>
              </Grid>
            </LocalizationProvider>
          )}

          {/* Display active filters as chips */}
          {(filters.startDate || 
           filters.endDate || 
           filters.accountNumber || 
           filters.transactionType || 
           filters.amount.min || 
           filters.amount.max) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {filters.startDate && (
                <Chip 
                  label={`From: ${filters.startDate.toLocaleDateString()}`}
                  onDelete={() => handleFilterChange('startDate', null)}
                />
              )}
              {filters.endDate && (
                <Chip 
                  label={`To: ${filters.endDate.toLocaleDateString()}`}
                  onDelete={() => handleFilterChange('endDate', null)}
                />
              )}
              {filters.accountNumber && (
                <Chip 
                  label={`Account: ${filters.accountNumber}`}
                  onDelete={() => handleFilterChange('accountNumber', '')}
                />
              )}
              {filters.transactionType && (
                <Chip 
                  label={`Type: ${filters.transactionType}`}
                  onDelete={() => handleFilterChange('transactionType', '')}
                />
              )}
              {filters.amount.min && (
                <Chip 
                  label={`Min: $${filters.amount.min}`}
                  onDelete={() => handleAmountFilterChange('min', '')}
                />
              )}
              {filters.amount.max && (
                <Chip 
                  label={`Max: $${filters.amount.max}`}
                  onDelete={() => handleAmountFilterChange('max', '')}
                />
              )}
            </Box>
          )}

          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="transactions table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.accountNumber}</TableCell>
                    <TableCell>{transaction.customerName}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: transaction.amount >= 0 ? 'success.main' : 'error.main',
                        fontWeight: 'medium'
                      }}
                    >
                      {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.status} 
                        color={transaction.status === 'Completed' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TransactionsPage; 