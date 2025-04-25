import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowForward as ArrowForwardIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import transactionService from '../../services/transaction.service';
import { formatCurrency, formatDate } from '../../utils/format';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [orderDirection, setOrderDirection] = useState('desc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [reconnecting, setReconnecting] = useState(false);

  // Get transaction statistics
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalTransfers: 0
  });

  const handleReconnect = async () => {
    setReconnecting(true);
    setError('Connection error. We\'re attempting to reconnect automatically. Please wait a moment...');
    
    try {
      // First check if the service is available
      const statusResponse = await transactionService.checkServiceStatus();
      
      if (statusResponse.data.status === 'down') {
        setError('Network connection issue. Please check your internet connection and try again.');
      } else {
        // If service is up, retry fetching transactions
        try {
          setLoading(true);
          const response = await transactionService.getCustomerTransactions();
          const data = response.data;
          setTransactions(data);
          setFilteredTransactions(data);
          
          // Calculate statistics
          const totalDeposits = data.filter(t => t.transactionType === 'deposit')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
          const totalWithdrawals = data.filter(t => t.transactionType === 'withdrawal')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
          const totalTransfers = data.filter(t => t.transactionType === 'transfer')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
          
          setStats({
            totalTransactions: data.length,
            totalDeposits,
            totalWithdrawals,
            totalTransfers
          });
          
          // Clear error on success
          setError('');
        } catch (err) {
          setError('Failed to load transactions after reconnecting. Please try again.');
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setReconnecting(false);
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await transactionService.getCustomerTransactions();
      const data = response.data;
      setTransactions(data);
      setFilteredTransactions(data);
      
      // Calculate statistics
      const totalDeposits = data.filter(t => t.transactionType === 'deposit')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const totalWithdrawals = data.filter(t => t.transactionType === 'withdrawal')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const totalTransfers = data.filter(t => t.transactionType === 'transfer')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      setStats({
        totalTransactions: data.length,
        totalDeposits,
        totalWithdrawals,
        totalTransfers
      });
    } catch (err) {
      let errorMessage = 'Failed to load transactions. Please try again later.';
      
      // Handle specific error cases
      if (err.response) {
        // Server responded with an error
        switch (err.response.status) {
          case 401:
            errorMessage = 'Your session has expired. Please log in again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to view transactions.';
            break;
          case 404:
            errorMessage = 'Account not found. Please contact support.';
            break;
          case 500:
            errorMessage = 'Server error. Our team has been notified.';
            break;
          default:
            errorMessage = `Error: ${err.response.data.message || 'Failed to load transactions'}`;
        }
      } else if (err.request) {
        // Request was made but no response received - this is a network error
        // Start the reconnection process after a short delay
        setError('Connection error. We\'re attempting to reconnect automatically. Please wait a moment...');
        
        // Attempt to reconnect after a brief delay
        setTimeout(() => {
          handleReconnect();
        }, 2000);
        
        return; // Exit early to prevent setting error message twice
      }
      
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filter and sort transactions when dependencies change
    let result = [...transactions];

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(transaction => transaction.transactionType === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(transaction => 
        (transaction.description && transaction.description.toLowerCase().includes(term)) ||
        (transaction.reference && transaction.reference.toLowerCase().includes(term)) ||
        (transaction.toAccount && transaction.toAccount.toLowerCase().includes(term)) ||
        (transaction.fromAccount && transaction.fromAccount.toLowerCase().includes(term))
      );
    }

    // Sort transactions
    result.sort((a, b) => {
      let valueA = a[orderBy];
      let valueB = b[orderBy];
      
      // Handle dates
      if (orderBy === 'createdAt') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }
      
      // Handle numeric values
      if (orderBy === 'amount' || orderBy === 'balanceAfter') {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      }
      
      if (valueA < valueB) {
        return orderDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return orderDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredTransactions(result);
  }, [transactions, searchTerm, filterType, orderBy, orderDirection]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getTransactionTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownwardIcon style={{ color: 'green' }} />;
      case 'withdrawal':
        return <ArrowUpwardIcon style={{ color: 'red' }} />;
      case 'transfer':
        return <ArrowForwardIcon style={{ color: 'blue' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'deposit':
        return 'success';
      case 'withdrawal':
        return 'error';
      case 'transfer':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="fade-in">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="fade-in">
        <Alert 
          severity="error" 
          sx={{ mt: 4, p: 3 }}
          action={
            <Button 
              color="error" 
              variant="contained"
              size="medium" 
              startIcon={<RefreshIcon />}
              onClick={reconnecting ? undefined : handleReconnect}
              disabled={reconnecting}
              sx={{ ml: 2 }}
            >
              {reconnecting ? 'Reconnecting...' : 'Retry Now'}
            </Button>
          }
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium', mr: 1 }}>
              {error}
            </Typography>
            {reconnecting && (
              <CircularProgress size={20} color="inherit" sx={{ ml: 2 }} />
            )}
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="fade-in">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 3 }}>
        Transaction History
      </Typography>

      {/* Transaction Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                Total Transactions
              </Typography>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {stats.totalTransactions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-card">
            <CardContent sx={{ textAlign: 'center', color: 'success.main' }}>
              <Typography variant="h6" color="textSecondary">
                Total Deposits
              </Typography>
              <Typography variant="h4" sx={{ mt: 2, color: 'success.main' }}>
                {formatCurrency(stats.totalDeposits)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                Total Withdrawals
              </Typography>
              <Typography variant="h4" sx={{ mt: 2, color: 'error.main' }}>
                {formatCurrency(stats.totalWithdrawals)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                Total Transfers
              </Typography>
              <Typography variant="h4" sx={{ mt: 2, color: 'info.main' }}>
                {formatCurrency(stats.totalTransfers)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by description, reference, or account..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="filter-type-label">Transaction Type</InputLabel>
              <Select
                labelId="filter-type-label"
                value={filterType}
                onChange={handleFilterChange}
                label="Transaction Type"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Transactions</MenuItem>
                <MenuItem value="deposit">Deposits</MenuItem>
                <MenuItem value="withdrawal">Withdrawals</MenuItem>
                <MenuItem value="transfer">Transfers</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Transactions Table */}
      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="transactions table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Type
                  </Box>
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => handleRequestSort('description')}
                  >
                    Description
                    {orderBy === 'description' && (
                      <IconButton size="small">
                        {orderDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => handleRequestSort('amount')}
                  >
                    Amount
                    {orderBy === 'amount' && (
                      <IconButton size="small">
                        {orderDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>
                  <Box 
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => handleRequestSort('createdAt')}
                  >
                    Date
                    {orderBy === 'createdAt' && (
                      <IconButton size="small">
                        {orderDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow hover key={transaction.id}>
                    <TableCell>
                      <Chip
                        icon={getTransactionTypeIcon(transaction.transactionType)}
                        label={transaction.transactionType.charAt(0).toUpperCase() + transaction.transactionType.slice(1)}
                        color={getTransactionTypeColor(transaction.transactionType)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell sx={{ 
                      color: transaction.transactionType === 'deposit' ? 'success.main' : 
                             transaction.transactionType === 'withdrawal' ? 'error.main' : 'info.main',
                      fontWeight: 'bold'
                    }}>
                      {transaction.transactionType === 'deposit' ? '+' : 
                       transaction.transactionType === 'withdrawal' ? '-' : ''}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)} 
                        color={getStatusColor(transaction.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                  </TableRow>
                ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default TransactionsPage; 