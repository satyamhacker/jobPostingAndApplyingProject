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
      // Send the data to the backend
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
        }),
      });
  
      const data = await response.json(); // Extract the JSON response body
  
      if (!response.ok) {
        alert(data.message); // Display the backend message as an alert
        throw new Error(data.message || 'Registration failed!');
      }
  
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds on success
    } catch (error) {
      setError(error.message); // Display error in alert component
    }
  };
  
  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left Side with Illustration or Text */}
      <Grid
        item
        xs={12} md={6}
        sx={{
          backgroundColor: '#e8f0f2', // Soft blue-gray for a professional look
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
          src="https://cdn-icons-png.flaticon.com/512/206/206134.png" // Updated managerial-themed icon
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
          backgroundColor: '#f5f5f5', // Light gray background
          padding: 3, // Maintain padding for better layout
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
                    backgroundColor: '#424242', // Dark background
                    '& .MuiInputBase-input': {
                      color: '#fff', // White text color
                    },
                    '& .MuiInputLabel-root': {
                      color: '#bbb', // Light label color
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#bbb', // Light border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#fff', // White border on hover
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#fff', // White border when focused
                      },
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
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#bbb',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#bbb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#fff',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#fff',
                      },
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
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#bbb',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#bbb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#fff',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#fff',
                      },
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
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#bbb',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#bbb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#fff',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#fff',
                      },
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
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#bbb',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#bbb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#fff',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#fff',
                      },
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
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#bbb',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#bbb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#fff',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#fff',
                      },
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
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#bbb',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#bbb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#fff',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#fff',
                      },
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
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#bbb',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#bbb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#fff',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#fff',
                      },
                    },
                  }}
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
