import React, { useState } from 'react';
import { 
  Avatar, 
  Button, 
  TextField, 
  Paper, 
  Box, 
  Grid, 
  Typography, 
  Container,
  Alert,
  Link
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useTheme();

  // Check if there's a message from registration or other sources
  useState(() => {
    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setError('');
      const user = await login(email, password);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to log in. Please verify your credentials.');
    }
  };

  // Dark mode specific styles
  const darkModeStyles = mode === 'dark' ? {
    paper: {
      background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    avatar: {
      background: 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.5)'
    }
  } : {
    paper: {},
    avatar: {}
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={6} 
        sx={{ 
          mt: 8, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2,
          ...darkModeStyles.paper
        }}
      >
        <Avatar sx={{ 
          m: 1, 
          bgcolor: 'primary.main',
          ...darkModeStyles.avatar 
        }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" 
          sx={{ 
            fontWeight: mode === 'dark' ? 500 : 400,
            letterSpacing: mode === 'dark' ? '0.05em' : 'normal'
          }}
        >
          Sign in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : undefined,
                },
                '&:hover fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : undefined,
                },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : undefined,
                },
                '&:hover fieldset': {
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : undefined,
                },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2,
              background: mode === 'dark' 
                ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)' 
                : undefined,
              boxShadow: mode === 'dark' 
                ? '0 3px 5px 2px rgba(0, 0, 0, .3)' 
                : undefined
            }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item>
              <Link 
                component={RouterLink} 
                to="/register" 
                variant="body2"
                sx={{
                  color: mode === 'dark' ? '#90caf9' : undefined,
                  textDecoration: mode === 'dark' ? 'none' : undefined,
                  '&:hover': {
                    textDecoration: mode === 'dark' ? 'underline' : undefined
                  }
                }}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage; 