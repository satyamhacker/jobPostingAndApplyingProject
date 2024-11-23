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
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Reset previous error messages
    setError('');

    // Prepare the data to be sent to the backend
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      country: form.country,
      mobile: form.mobile,
      password: form.password,
    };

    try {
      // Send the data to the backend
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json(); // Extract the JSON response body
  
      if (!response.ok) {
        // If response is not okay, set error message from backend
        setError(data.message || 'Registration failed!');
        return; // Exit the function
      }
  
      // Registration successful
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds on success
    } catch (error) {
      setError('Server error: ' + error.message); // Display error in alert component
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Side with Illustration or Text */}
      <Grid
        item
        xs={12} md={6}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' }}
        >
          <Typography variant="h4" gutterBottom>
            Bringing out the potential in you
          </Typography>
          <img
            src="https://cdn-icons-png.flaticon.com/512/201/201614.png"
            alt="Illustration"
            width="300"
            style={{ marginTop: '20px' }}
          />
        </Box>
      </Grid>

      {/* Right Side with Registration Form */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" gutterBottom>
            Career Opportunities: Create an Account
          </Typography>
          <Typography align="center" sx={{ mb: 2 }}>
            Already a registered user?{' '}
            <Link href="/auth/applicant-login" underline="hover">
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
                />
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
