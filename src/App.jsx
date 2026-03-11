import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import LoginPage from './components/LoginPage';
import LibraryPage from './components/LibraryPage';

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    secondary: { main: '#f57c00' },
  },
});

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  function handleLogin(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  }

  function handleLogout() {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {currentUser === null ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <LibraryPage currentUser={currentUser} onLogout={handleLogout} />
      )}
    </ThemeProvider>
  );
}
