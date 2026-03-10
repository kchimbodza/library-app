// LoginPage.jsx
// Shows two tabs: "Sign In" and "Register"
// When login succeeds, it calls the onLogin function passed in from App.jsx

import { useState } from 'react';
import {
  Box,           // A general-purpose layout container (like a div)
  Card,          // A white card with a shadow
  CardContent,   // Padding inside a Card
  Typography,    // For displaying text with MUI styling
  TextField,     // A styled text input
  Button,        // A clickable button
  Tabs,          // The tab bar container
  Tab,           // A single tab button
  Alert,         // A coloured message box for errors or success
  Select,        // A dropdown selector
  MenuItem,      // One option inside a Select
  FormControl,   // A wrapper that connects a label to a Select
  InputLabel,    // The floating label for a Select
} from '@mui/material';
import { loginUser, registerUser } from '../api'; // Our API functions

export default function LoginPage({ onLogin }) {
  // tab controls which panel is visible: 0 = Sign In, 1 = Register
  const [tab, setTab] = useState(0);

  // --- Sign In form state ---
  const [loginUsername, setLoginUsername] = useState(''); // Tracks what user types in username field
  const [loginPassword, setLoginPassword] = useState(''); // Tracks what user types in password field
  const [loginError, setLoginError]       = useState(''); // Error message to show if login fails

  // --- Register form state ---
  const [regUsername, setRegUsername] = useState('');     // New account username
  const [regPassword, setRegPassword] = useState('');     // New account password
  const [regConfirm,  setRegConfirm]  = useState('');     // Confirm password (must match regPassword)
  const [regRole,     setRegRole]     = useState('user'); // Role dropdown: 'user' or 'librarian'
  const [regError,    setRegError]    = useState('');     // Error message for register form
  const [regSuccess,  setRegSuccess]  = useState('');     // Success message after account is created

  // Called when the Sign In form is submitted
  async function handleLogin(e) {
    e.preventDefault();        // Stop the browser from reloading the page
    setLoginError('');         // Clear any previous error message

    // Check that both fields are filled in
    if (!loginUsername || !loginPassword) {
      setLoginError('Please fill in all fields');
      return;                  // Stop here — don't send the request
    }

    // Send the username and password to the API to check if they match
    const result = await loginUser(loginUsername, loginPassword);

    if (result.success) {
      onLogin(result.user);    // Tell App.jsx the user is logged in
    } else {
      setLoginError(result.error); // Show the error message returned by the API
    }
  }

  // Called when the Register form is submitted
  async function handleRegister(e) {
    e.preventDefault();  // Stop page reload
    setRegError('');     // Clear previous errors
    setRegSuccess('');   // Clear previous success message

    // Check all fields are filled
    if (!regUsername || !regPassword || !regConfirm) {
      setRegError('Please fill in all fields');
      return;
    }

    // Check that the two password fields match
    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match');
      return;
    }

    // Send the new account details to the API
    const result = await registerUser(regUsername, regPassword, regRole);

    if (result.success) {
      setRegSuccess('Account created! You can now sign in.'); // Show success
      // Clear the form fields
      setRegUsername('');
      setRegPassword('');
      setRegConfirm('');
    } else {
      setRegError(result.error); // e.g. "Username already taken"
    }
  }

  return (
    // Centre everything vertically and horizontally on a light blue background
    <Box
      sx={{
        minHeight: '100vh',          // Fill the full screen height
        backgroundColor: '#e3f2fd',  // Light blue background
        display: 'flex',             // Use flexbox to centre the card
        alignItems: 'center',        // Centre vertically
        justifyContent: 'center',    // Centre horizontally
      }}
    >
      {/* The white card that contains the form */}
      <Card sx={{ width: 400 }} elevation={4}>
        <CardContent sx={{ p: 4 }}>

          {/* App title */}
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
            📚 Library App
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Sign in or create an account
          </Typography>

          {/* Tab bar — clicking a tab changes the 'tab' state */}
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {/* ── SIGN IN FORM ── only shown when tab === 0 */}
          {tab === 0 && (
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>

              {/* Only show the Alert if loginError has text */}
              {loginError && (
                <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>
              )}

              {/* Username input — updates loginUsername state on every keystroke */}
              <TextField
                label="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                fullWidth   // Stretch to fill the card width
                sx={{ mb: 2 }}
              />

              {/* Password input — type="password" hides the characters */}
              <TextField
                label="Password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
              />

              {/* Submit button — triggers handleLogin */}
              <Button type="submit" variant="contained" fullWidth size="large">
                Sign In
              </Button>
            </Box>
          )}

          {/* ── REGISTER FORM ── only shown when tab === 1 */}
          {tab === 1 && (
            <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>

              {/* Show error message if registration fails */}
              {regError && (
                <Alert severity="error" sx={{ mb: 2 }}>{regError}</Alert>
              )}

              {/* Show success message when account is created */}
              {regSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>{regSuccess}</Alert>
              )}

              <TextField
                label="Username"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                label="Password"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                label="Confirm Password"
                type="password"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />

              {/* Role dropdown — FormControl + InputLabel + Select is the MUI pattern */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={regRole}
                  label="Role"
                  onChange={(e) => setRegRole(e.target.value)}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="librarian">Librarian</MenuItem>
                </Select>
              </FormControl>

              <Button type="submit" variant="contained" color="secondary" fullWidth size="large">
                Create Account
              </Button>
            </Box>
          )}

        </CardContent>
      </Card>
    </Box>
  );
}
