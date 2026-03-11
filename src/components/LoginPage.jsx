import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { loginUser, registerUser } from '../api';

export default function LoginPage({ onLogin }) {
  const [tab, setTab] = useState(0);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError]       = useState('');

  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm,  setRegConfirm]  = useState('');
  const [regRole,     setRegRole]     = useState('user');
  const [regError,    setRegError]    = useState('');
  const [regSuccess,  setRegSuccess]  = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    if (!loginUsername || !loginPassword) {
      setLoginError('Please fill in all fields');
      return;
    }
    const result = await loginUser(loginUsername, loginPassword);
    if (result.success) {
      onLogin(result.user);
    } else {
      setLoginError(result.error);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    if (!regUsername || !regPassword || !regConfirm) {
      setRegError('Please fill in all fields');
      return;
    }
    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match');
      return;
    }
    const result = await registerUser(regUsername, regPassword, regRole);
    if (result.success) {
      setRegSuccess('Account created! You can now sign in.');
      setRegUsername('');
      setRegPassword('');
      setRegConfirm('');
    } else {
      setRegError(result.error);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#e3f2fd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ width: 400 }} elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
            📚 Library App
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Sign in or create an account
          </Typography>

          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {tab === 0 && (
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
              {loginError && (
                <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>
              )}
              <TextField
                label="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
              />
              <Button type="submit" variant="contained" fullWidth size="large">
                Sign In
              </Button>
            </Box>
          )}

          {tab === 1 && (
            <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>
              {regError && (
                <Alert severity="error" sx={{ mb: 2 }}>{regError}</Alert>
              )}
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
