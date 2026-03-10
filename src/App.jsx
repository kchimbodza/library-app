// App.jsx is the root of the application
// It decides whether to show the Login page or the Library page

import { useState, useEffect } from 'react';                   // useState stores data, useEffect runs code on load
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'; // MUI setup
import LoginPage from './components/LoginPage';                // The login/register screen
import LibraryPage from './components/LibraryPage';            // The main library screen

// Create a colour theme for the whole app
// Every MUI component will use these colours automatically
const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },   // Blue — used for main buttons, AppBar
    secondary: { main: '#f57c00' }, // Orange — used for secondary buttons
  },
});

export default function App() {
  // currentUser holds the logged-in user object, or null if nobody is logged in
  const [currentUser, setCurrentUser] = useState(null);

  // useEffect runs once when the app first loads
  // It checks if a user was previously saved in localStorage (so they stay logged in on refresh)
  useEffect(() => {
    const saved = localStorage.getItem('currentUser'); // Try to read saved user from browser storage
    if (saved) {
      setCurrentUser(JSON.parse(saved));               // If found, restore them as the current user
    }
  }, []); // The empty [] means "only run this once, when the component first mounts"

  // Called when the user successfully logs in
  function handleLogin(user) {
    localStorage.setItem('currentUser', JSON.stringify(user)); // Save to browser storage
    setCurrentUser(user);                                      // Update state so the page re-renders
  }

  // Called when the user clicks Sign Out
  function handleLogout() {
    localStorage.removeItem('currentUser'); // Remove from browser storage
    setCurrentUser(null);                   // Clear state — this causes the login page to show
  }

  return (
    // ThemeProvider makes our theme available to all components inside it
    <ThemeProvider theme={theme}>
      {/* CssBaseline resets browser default styles so everything looks consistent */}
      <CssBaseline />

      {/* If no user is logged in, show LoginPage. Otherwise show LibraryPage */}
      {currentUser === null ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <LibraryPage currentUser={currentUser} onLogout={handleLogout} />
      )}
    </ThemeProvider>
  );
}
