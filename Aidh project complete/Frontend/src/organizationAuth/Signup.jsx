import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Grid,
  Alert,
  InputAdornment,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// List of countries
const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 
  'India', 'Germany', 'France'
];

// List of roles
const roles = ['HR', 'Admin', 'Manager'];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    country: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: '', // New field for role
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some((value) => value === '')) {
      setError('All fields are mandatory!');
      return;
    }
    if (form.email !== form.confirmEmail) {
      setError('Emails do not match!');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setError('');

    try {
      console.log(form);
      const response = await fetch('http://localhost:3000/organization-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          country: form.country,
          mobile: form.mobile,
          password: form.password,
          role: form.role, // Include role in the request
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        throw new Error(data.message || 'Registration failed!');
      }

      setSuccess(true);
      alert("Registration Successful!");
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Side with Illustration or Text */}
      <Grid
        item
        xs={12} md={6}
        sx={{
          backgroundColor: '#e8f0f2',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Bringing out the potential in you
        </Typography>
        <img
          src="https://cdn-icons-png.flaticon.com/512/206/206134.png"
          alt="Managerial Illustration"
          width="300"
          style={{ marginTop: '20px' }}
        />
      </Grid>

      {/* Right Side with Registration Form */}
      <Grid 
        item 
        xs={12} md={6} 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#f5f5f5',
          padding: 3,
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" gutterBottom>
            Organization: Create an Account
          </Typography>
          <Typography align="center" sx={{ mb: 2 }}>
            Already a registered user?{' '}
            <Link href="/auth/organization-login" underline="hover">
              Sign in
            </Link>
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Registration Successful!</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    backgroundColor: '#424242',
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#bbb' },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#fff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    backgroundColor: '#424242',
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#bbb' },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#fff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    backgroundColor: '#424242',
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#bbb' },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#fff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm Email Address"
                  name="confirmEmail"
                  type="email"
                  value={form.confirmEmail}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    backgroundColor: '#424242',
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#bbb' },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#fff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    backgroundColor: '#424242',
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#bbb' },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#fff' },
                    },
                  }}
                >
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mobile Number"
                  name="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+ Code</InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: '#424242',
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#bbb' },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#fff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    backgroundColor: '#424242',
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#bbb' },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#fff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    backgroundColor: '#424242',
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#bbb' },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#fff' },
                    },
                  }}
                />
              </Grid>

              {/* New dropdown for Role */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    backgroundColor: '#424242',
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#bbb' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#bbb' },
                      '&:hover fieldset': { borderColor: '#fff' },
                      '&.Mui-focused fieldset': { borderColor: '#fff' },
                    },
                  }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, borderRadius: '25px' }}
            >
              Register
            </Button>

            <Button
              variant="text"
              onClick={() => navigate('/')}
              fullWidth
              sx={{ mt: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Register;
