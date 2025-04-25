import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Container, 
  Grid, 
  Typography, 
  Paper,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  PhoneAndroid as PhoneAndroidIcon,
  Speed as SpeedIcon,
  InsertChart as InsertChartIcon,
  AccountBalanceWallet as WalletIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const HomePage = () => {
  const { currentUser } = useAuth();
  const [featuredIndex, setFeaturedIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // Features section
  const features = [
    {
      icon: <AccountBalanceIcon fontSize="large" color="primary" />,
      title: "Online Banking",
      description: "Access your account 24/7 from anywhere. Check balances, view transactions, and manage your money with ease."
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: "Secure Transactions",
      description: "Bank with confidence knowing your data and transactions are protected with industry-leading security."
    },
    {
      icon: <PhoneAndroidIcon fontSize="large" color="primary" />,
      title: "Mobile Experience",
      description: "Our responsive design works on all your devices, giving you a seamless banking experience."
    },
    {
      icon: <SpeedIcon fontSize="large" color="primary" />,
      title: "Fast Transfers",
      description: "Send money to your beneficiaries quickly and securely with our fast transfer system."
    },
    {
      icon: <InsertChartIcon fontSize="large" color="primary" />,
      title: "Financial Insights",
      description: "Get personalized insights and analytics to help you manage your finances better and reach your financial goals.",
      hasAction: true,
      actionText: "Learn More"
    },
    {
      icon: <WalletIcon fontSize="large" color="primary" />,
      title: "Budgeting Tools",
      description: "Take control of your finances with our budgeting tools. Set budgets, track expenses, and achieve your savings goals.",
      hasAction: true,
      actionText: "Explore Tools"
    }
  ];

  // Feature comparison data
  const comparisonData = [
    { feature: "24/7 Online Access", free: true, premium: true, business: true },
    { feature: "Mobile Banking", free: true, premium: true, business: true },
    { feature: "Bill Payments", free: true, premium: true, business: true },
    { feature: "Financial Insights", free: false, premium: true, business: true },
    { feature: "Budgeting Tools", free: false, premium: true, business: true },
    { feature: "Investment Tracking", free: false, premium: true, business: true },
    { feature: "Business Analytics", free: false, premium: false, business: true },
    { feature: "Multi-User Access", free: false, premium: false, business: true }
  ];

  // Handle feature card click
  const handleFeatureClick = (index) => {
    // Different actions based on which feature was clicked
    const feature = features[index];
    
    switch(feature.title) {
      case "Online Banking":
        setSnackbarMessage("Connecting to secure online banking portal...");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
        // Simulate loading
        setTimeout(() => {
          setSnackbarMessage("Online banking features are available after login");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }, 1500);
        break;
        
      case "Secure Transactions":
        setSnackbarMessage("Checking security protocols...");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
        // Simulate verification
        setTimeout(() => {
          setSnackbarMessage("All security systems are active and working properly");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }, 1500);
        break;
        
      case "Mobile Experience":
        setSnackbarMessage("Opening mobile app preview...");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
        // Simulate mobile app info
        setTimeout(() => {
          setSnackbarMessage("Download our mobile app from App Store or Google Play for the full experience");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }, 1500);
        break;
        
      case "Fast Transfers":
        setSnackbarMessage("Calculating transfer speeds...");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
        // Simulate results
        setTimeout(() => {
          setSnackbarMessage("Our transfers complete in less than 10 seconds to any supported bank");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }, 1500);
        break;
        
      case "Financial Insights":
        // For features with existing "Learn More" functionality, show the detailed view
        setFeaturedIndex(index);
        break;
        
      case "Budgeting Tools":
        // For features with existing "Explore Tools" functionality, show the detailed view
        setFeaturedIndex(index);
        break;
        
      default:
        setSnackbarMessage(`Exploring ${feature.title} feature...`);
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url('https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')`,
        }}
      >
        {/* Increase the priority of the hero background image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.6)',
          }}
        />
        <Grid container>
          <Grid item md={6}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                Welcome to Modern Banking
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Experience secure, efficient banking with our state-of-the-art digital platform.
                Manage your accounts, make transfers, and track your finances, all in one place.
              </Typography>
              <Box sx={{ mt: 3 }}>
                {!currentUser ? (
                  <>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      component={RouterLink} 
                      to="/register" 
                      sx={{ mr: 2 }}
                    >
                      Register Now
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      component={RouterLink} 
                      to="/login"
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          borderColor: 'white'
                        }
                      }}
                    >
                      Login
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    component={RouterLink} 
                    to={currentUser.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  >
                    Go to Dashboard
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Features Section */}
      <Typography variant="h4" align="center" gutterBottom>
        Our Features
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        Experience the best of modern banking with our comprehensive features.
      </Typography>
      
      {featuredIndex !== null && (
        <Box sx={{ mb: 4, mt: 2, p: 3, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
          <Typography variant="h5" gutterBottom>
            {features[featuredIndex].title} Feature Highlight
          </Typography>
          <Typography variant="body1" paragraph>
            {features[featuredIndex].title === "Financial Insights" ? 
              "Our AI-powered financial insights analyze your spending patterns and provide personalized recommendations to help you save more and spend smarter." :
              features[featuredIndex].title === "Budgeting Tools" ?
              "Create custom budgets by category, set spending limits, and receive alerts when you're approaching your limits. Our visual charts make tracking your progress simple and intuitive." :
              "Learn more about this feature by signing up for our service today!"}
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => setFeaturedIndex(null)} 
            size="small"
          >
            Close
          </Button>
        </Box>
      )}
      
      <Grid container spacing={4} sx={{ mt: 3 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={feature.hasAction ? 4 : 3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                  cursor: 'pointer'
                },
                position: 'relative'
              }}
              onClick={() => handleFeatureClick(index)}
            >
              {index === features.length - 1 && (
                <Chip 
                  label="New" 
                  color="primary" 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10, 
                    zIndex: 1 
                  }} 
                />
              )}
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography>
                  {feature.description}
                </Typography>
              </CardContent>
              {feature.hasAction && (
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      setFeaturedIndex(index);
                    }}
                  >
                    {feature.actionText}
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for feature interactions */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Divider sx={{ my: 6 }} />

      {/* Feature Comparison */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Compare Account Features
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Choose the account type that suits your needs
        </Typography>
        
        <Accordion defaultExpanded sx={{ mt: 3 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">Feature Comparison Chart</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="feature comparison table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Feature</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Free Account</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Premium Account</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Business Account</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comparisonData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.feature}
                      </TableCell>
                      <TableCell align="center">{row.free ? <CheckIcon color="success" /> : "-"}</TableCell>
                      <TableCell align="center">{row.premium ? <CheckIcon color="success" /> : "-"}</TableCell>
                      <TableCell align="center">{row.business ? <CheckIcon color="success" /> : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
              <Button variant="outlined" color="primary" component={RouterLink} to="/register">
                Open Free Account
              </Button>
              <Button variant="contained" color="primary" component={RouterLink} to="/register">
                Upgrade to Premium
              </Button>
              <Button variant="contained" color="secondary" component={RouterLink} to="/register">
                Business Solutions
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'background.paper', p: 6, my: 4, textAlign: 'center' }}>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Ready to experience modern banking?
        </Typography>
        {!currentUser && (
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            component={RouterLink} 
            to="/register"
          >
            Get Started
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default HomePage; 