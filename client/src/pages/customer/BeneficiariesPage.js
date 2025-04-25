import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { userService } from '../../services/userService';

const BeneficiariesPage = () => {
  const navigate = useNavigate();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const data = await userService.getBeneficiaries();
      setBeneficiaries(data || []);
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
      setError('Failed to load beneficiaries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBeneficiary = () => {
    navigate('/beneficiaries/add');
  };

  const handleEditBeneficiary = (id) => {
    navigate(`/beneficiaries/edit/${id}`);
  };

  const handleDeleteDialogOpen = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedBeneficiary(null);
  };

  const handleDeleteBeneficiary = async () => {
    try {
      setLoading(true);
      await userService.deleteBeneficiary(selectedBeneficiary.id);
      setBeneficiaries(prevBeneficiaries => 
        prevBeneficiaries.filter(b => b.id !== selectedBeneficiary.id)
      );
      handleDeleteDialogClose();
    } catch (err) {
      setError('Failed to delete beneficiary. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Beneficiaries
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddBeneficiary}
        >
          Add Beneficiary
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      <Paper elevation={3}>
        {loading && beneficiaries.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : beneficiaries.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">
              You haven't added any beneficiaries yet.
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />} 
              sx={{ mt: 2 }}
              onClick={handleAddBeneficiary}
            >
              Add Your First Beneficiary
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>Bank</TableCell>
                  <TableCell>Account Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {beneficiaries.map((beneficiary) => (
                  <TableRow key={beneficiary.id}>
                    <TableCell>{beneficiary.name}</TableCell>
                    <TableCell>{beneficiary.accountNumber}</TableCell>
                    <TableCell>{beneficiary.bankName}</TableCell>
                    <TableCell style={{ textTransform: 'capitalize' }}>
                      {beneficiary.accountType}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditBeneficiary(beneficiary.id)}
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteDialogOpen(beneficiary)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Delete Beneficiary</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedBeneficiary?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteBeneficiary} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BeneficiariesPage; 