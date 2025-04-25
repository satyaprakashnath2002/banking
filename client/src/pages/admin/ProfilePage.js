import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
  TextField,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Devices as DevicesIcon,
  Logout as LogoutIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
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

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    department: '',
    employeeId: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    browserNotifications: true,
    loginNotifications: true,
    systemUpdates: true,
    customerAlerts: true
  });
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      device: 'Windows PC',
      browser: 'Chrome',
      ipAddress: '192.168.1.1',
      location: 'New York, USA',
      lastActive: '2023-04-15 14:30',
      current: true
    },
    {
      id: 2,
      device: 'iPhone',
      browser: 'Safari',
      ipAddress: '192.168.1.2',
      location: 'New York, USA',
      lastActive: '2023-04-14 09:15',
      current: false
    }
  ]);

  useEffect(() => {
    // In a real application, you would fetch profile data from an API
    const fetchProfile = () => {
      // Simulating API call with timeout
      setTimeout(() => {
        const mockProfile = {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@bankingapp.com',
          phoneNumber: '555-123-4567',
          jobTitle: 'System Administrator',
          department: 'IT',
          employeeId: 'EMP001',
          address: '123 Bank St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          profilePicture: '',
          lastPasswordChange: '2023-02-15',
          twoFactorEnabled: true
        };
        
        setProfile(mockProfile);
        setFormData({
          firstName: mockProfile.firstName,
          lastName: mockProfile.lastName,
          email: mockProfile.email,
          phoneNumber: mockProfile.phoneNumber,
          jobTitle: mockProfile.jobTitle,
          department: mockProfile.department,
          employeeId: mockProfile.employeeId,
          address: mockProfile.address,
          city: mockProfile.city,
          state: mockProfile.state,
          zipCode: mockProfile.zipCode,
          country: mockProfile.country
        });
        setLoading(false);
      }, 1000);
    };

    fetchProfile();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real application, you would send the updated data to your API
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => ({
        ...prev,
        ...formData
      }));
      
      setSuccess('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate password fields
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real application, you would send the password data to your API
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password changed successfully');
      setOpenPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real application, you would toggle 2FA via your API
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => ({
        ...prev,
        twoFactorEnabled: !prev.twoFactorEnabled
      }));
      
      setSuccess(`Two-factor authentication ${profile.twoFactorEnabled ? 'disabled' : 'enabled'} successfully`);
    } catch (err) {
      setError('Failed to update two-factor authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real application, you would terminate the session via your API
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      
      setSuccess('Session terminated successfully');
    } catch (err) {
      setError('Failed to terminate session');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real application, you would update notification settings via your API
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Notification settings updated successfully');
    } catch (err) {
      setError('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // In a real application, you would call your logout function here
    setOpenLogoutDialog(false);
    logout();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real application, you would upload the file to your server
      // For now, we'll just create a data URL for preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setProfile(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
    }
  };

  const handleCancelEdit = () => {
    // Reset form data
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      jobTitle: profile.jobTitle,
      department: profile.department,
      employeeId: profile.employeeId,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      zipCode: profile.zipCode,
      country: profile.country
    });
    setEditMode(false);
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Box sx={{ p: 4, display: 'flex', alignItems: 'flex-start' }}>
          <Box sx={{ position: 'relative', mr: 3 }}>
            <Avatar
              sx={{ width: 100, height: 100 }}
              src={profile?.profilePicture || ''}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="profile-picture-upload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <UploadIcon fontSize="small" />
              </IconButton>
            </label>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h4">
                  {profile?.firstName} {profile?.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {profile?.jobTitle} - {profile?.department}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Employee ID: {profile?.employeeId}
                </Typography>
              </Box>
              <Box>
                {editMode ? (
                  <>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mx: 4, mb: 2 }}>{error}</Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mx: 4, mb: 2 }}>{success}</Alert>
        )}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
          >
            <Tab icon={<PersonIcon />} label="Personal Info" />
            <Tab icon={<SecurityIcon />} label="Security" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<DevicesIcon />} label="Active Sessions" />
          </Tabs>
        </Box>
        
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
                disabled={true} // Email usually can't be changed directly
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
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                disabled={true} // Employee ID usually can't be changed
                margin="normal"
              />
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
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Password
            </Typography>
            <Typography variant="body2" gutterBottom>
              Last changed: {profile?.lastPasswordChange}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setOpenPasswordDialog(true)}
              sx={{ mt: 1 }}
            >
              Change Password
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Two-Factor Authentication
            </Typography>
            <Typography variant="body2" gutterBottom>
              {profile?.twoFactorEnabled
                ? 'Two-factor authentication is currently enabled'
                : 'Two-factor authentication is currently disabled'}
            </Typography>
            <Button
              variant={profile?.twoFactorEnabled ? 'outlined' : 'contained'}
              onClick={handleToggleTwoFactor}
              color={profile?.twoFactorEnabled ? 'error' : 'primary'}
              sx={{ mt: 1 }}
            >
              {profile?.twoFactorEnabled ? 'Disable' : 'Enable'} Two-Factor Authentication
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Sign Out
            </Typography>
            <Typography variant="body2" gutterBottom>
              Sign out from all devices
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => setOpenLogoutDialog(true)}
              sx={{ mt: 1 }}
            >
              Sign Out Everywhere
            </Button>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Email Alerts"
                secondary="Receive important notifications via email"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.emailAlerts}
                  onChange={() => handleNotificationChange('emailAlerts')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary="SMS Alerts"
                secondary="Receive important notifications via SMS"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.smsAlerts}
                  onChange={() => handleNotificationChange('smsAlerts')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Browser Notifications"
                secondary="Receive notifications in your browser"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.browserNotifications}
                  onChange={() => handleNotificationChange('browserNotifications')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText
                primary="Login Notifications"
                secondary="Get notified when someone logs into your account"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.loginNotifications}
                  onChange={() => handleNotificationChange('loginNotifications')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <DevicesIcon />
              </ListItemIcon>
              <ListItemText
                primary="System Updates"
                secondary="Get notified about system updates and maintenance"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.systemUpdates}
                  onChange={() => handleNotificationChange('systemUpdates')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="Customer Alerts"
                secondary="Get notified about customer account activities"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.customerAlerts}
                  onChange={() => handleNotificationChange('customerAlerts')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleSaveNotifications}
              disabled={loading}
            >
              Save Preferences
            </Button>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Active Sessions
          </Typography>
          
          <List>
            {activeSessions.map((session) => (
              <ListItem key={session.id} divider>
                <ListItemIcon>
                  <DevicesIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${session.device} - ${session.browser}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        IP: {session.ipAddress} | Location: {session.location}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Last active: {session.lastActive}
                      </Typography>
                      {session.current && (
                        <Typography component="span" variant="body2" color="primary.main" sx={{ ml: 1 }}>
                          (Current session)
                        </Typography>
                      )}
                    </>
                  }
                />
                {!session.current && (
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleTerminateSession(session.id)}
                    >
                      Terminate
                    </Button>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Paper>
      
      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your current password and a new password to update your credentials.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="currentPassword"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="dense"
            name="newPassword"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="dense"
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
            helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? 'Passwords do not match' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Logout Dialog */}
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Sign Out Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign out from all devices? This will terminate all active sessions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="error">
            Sign Out Everywhere
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage; 