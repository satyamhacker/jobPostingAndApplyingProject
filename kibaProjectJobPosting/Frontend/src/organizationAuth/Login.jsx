import React, { useState } from 'react';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';

const OrganizationLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form inputs
    if (!form.email || !form.password) {
      setError('Both email and password are required!');
      return;
    }

    try {
      // Send login request to the backend
      const response = await fetch('http://localhost:3000/organization-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors returned from the server
        alert(data.message); // Display the backend message as an alert
        throw new Error(data.message || 'Login failed');
      }

      // Store the token (you can also use localStorage or context for auth)
      localStorage.setItem('token', data.token);
      alert("Login successful");
      navigate("/admin/add-job"); // Navigate to dashboard after successful login

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center bg-black" style={{ minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '10px' }}>
            <Card.Body>
              <h3 className="text-center mb-4" style={{ color: '#343a40' }}>Organization Login</h3>

              {error && <div className="alert alert-danger">{error}</div>}

              <Form onSubmit={handleSubmit}>
                {/* Email Input */}
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label style={{ color: '#495057' }}>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ backgroundColor: '#e9ecef' }}
                  />
                </Form.Group>

                {/* Password Input with Visibility Toggle */}
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label style={{ color: '#495057' }}>Password</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: '#e9ecef' }}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeSlashFill /> : <EyeFill />}
                    </Button>
                  </div>
                </Form.Group>

                {/* Reset Password Link */}
                <div className="d-flex justify-content-between mb-3">
                  <Link to="/auth/organization-reset-password" className="text-muted">
                    Reset password?
                  </Link>
                </div>

                {/* Login Button */}
                <Button type="submit" variant="primary" className="w-100">
                  Login
                </Button>
              </Form>

              {/* Sign Up Link */}
              <div className="text-center mt-3">
                <span className="text-muted">New user? </span>
                <Link to="/auth/register">Create an account</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrganizationLogin;
