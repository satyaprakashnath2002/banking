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
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CustomersPage = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // In a real application, you would fetch data from an API
    const fetchCustomers = () => {
      // Simulating API call with timeout
      setTimeout(() => {
        const mockCustomers = Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          name: `Customer ${i + 1}`,
          email: `customer${i + 1}@example.com`,
          phoneNumber: `555-${100 + i}`,
          accountNumber: `1000${1000 + i}`,
          status: i % 5 === 0 ? 'Inactive' : 'Active',
          dateCreated: new Date(2023, 0, i + 1).toLocaleDateString(),
          lastLogin: i % 3 === 0 ? 'Never' : new Date(2023, 3, i + 1).toLocaleDateString()
        }));
        setCustomers(mockCustomers);
        setLoading(false);
      }, 1000);
    };

    fetchCustomers();
  }, []);

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

  const handleViewCustomer = (customerId) => {
    navigate(`/admin/customers/${customerId}`);
  };

  const handleAddCustomer = () => {
    navigate('/admin/account-opening');
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.accountNumber.includes(searchTerm)
  );

  const displayedCustomers = filteredCustomers
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Customer Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<PersonIcon />}
          onClick={handleAddCustomer}
        >
          Add New Customer
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name, email, or account number..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="customers table">
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedCustomers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell component="th" scope="row">
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell>{customer.accountNumber}</TableCell>
                    <TableCell>
                      <Chip 
                        label={customer.status} 
                        color={customer.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{customer.dateCreated}</TableCell>
                    <TableCell>{customer.lastLogin}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleViewCustomer(customer.id)}
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton 
                        color="secondary"
                        onClick={() => handleViewCustomer(customer.id)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCustomers.length}
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

export default CustomersPage; 