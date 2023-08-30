import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customSpacing: (value: number) => string;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#33c',
    },
    secondary: {
      main: '#ff0',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      marginBottom: '0.75rem',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      marginBottom: '0.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  spacing: 8,
  });

export default theme as any;
