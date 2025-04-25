import { createTheme } from '@mui/material/styles';

// Light theme colors
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',      // Blue - a trusted banking color
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#388e3c',      // Green - associated with money and growth
      light: '#4caf50',
      dark: '#2e7d32',
      contrastText: '#ffffff',
    },
    success: {
      main: '#388e3c',
      light: '#4caf50',
      dark: '#2e7d32',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#f57c00',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9e9e9e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

// Dark theme colors
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',      // Lighter blue that stands out in dark mode
      light: '#bbdefb',
      dark: '#64b5f6',
      contrastText: '#121212',
    },
    secondary: {
      main: '#81c784',      // Lighter green for dark mode
      light: '#a5d6a7',
      dark: '#66bb6a',
      contrastText: '#121212',
    },
    success: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#4caf50',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ffb74d',
      light: '#ffd54f',
      dark: '#ff9800',
    },
    info: {
      main: '#4fc3f7',
      light: '#81d4fa',
      dark: '#29b6f6',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
      disabled: '#78909c',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.5)',
          backgroundColor: '#1e1e1e',
        },
      },
    },
  },
});

export { lightTheme, darkTheme }; 