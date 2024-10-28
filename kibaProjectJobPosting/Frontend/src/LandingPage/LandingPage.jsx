import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Typography, Grid, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const LandingPage = () => {
  const navigate = useNavigate(); // React Router's navigation hook

  return (
    <Box sx={{ backgroundColor: '#0e1b2a', minHeight: '100vh', color: 'white' }}>
      {/* Header / Navbar */}
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#48b0a5' }}>
            AID-IPH
          </Typography>
          <Box>
            <Button onClick={() => navigate('/job-seekers/show-all-active-jobs')} color="inherit" sx={{ color: 'white' }}>For Job Seekers</Button>
            <Button
              color="inherit"
              variant="outlined"
              sx={{ ml: 2, borderColor: 'white', color: 'white' }}
              onClick={() => navigate('/auth/Organization-signup')} // Updated navigation path
            >
              Organization Signup
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="700" gutterBottom>
          Revolutionize <br /> Payroll & HR experience with
        </Typography>
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(90deg, #a0d468, #4fc3f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AID-IPH
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3, px: 5, borderRadius: '30px' }}
          startIcon={<PlayArrowIcon />}
          onClick={() => navigate('/auth/register')} // Navigate on click
        >
          Get Started
        </Button>
      </Container>

     
    </Box>
  );
};

export default LandingPage;
