import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const OrganizationResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(120); // 2 minutes timer
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendEnabled(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/send-otp', { // Adjust URL as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setOtpSent(true);
      setTimer(120); // Reset timer
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('OTP is required');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/verify-otp', { // Adjust URL as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setShowModal(true);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setError('New password is required');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/organization-reset-password', { // Adjust URL as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      alert('Password reset successfully Now you can login with new password!');
      navigate("/auth/organization-login"); // Navigate to the About page

      // Optionally redirect the user or reset state
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResendOtp = () => {
    setIsResendEnabled(false);
    handleSendOtp();
  };

  return (
    <Container className="d-flex justify-content-center align-items-center bg-black" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="text-center mb-4">Organization Member Reset Password</h3>

              {error && <div className="alert alert-danger">{error}</div>}

              {!otpSent ? (
                <Form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100">
                    Send OTP
                  </Button>
                </Form>
              ) : (
                <Form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
                  <Form.Group className="mb-3">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the OTP sent to your email"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100">
                    Verify OTP
                  </Button>
                  <div className="text-center mt-3">
                    {isResendEnabled ? (
                      <Button variant="link" onClick={handleResendOtp}>
                        Resend OTP
                      </Button>
                    ) : (
                      <p>Resend OTP in {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</p>
                    )}
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for setting new password */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password for {email}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Reset Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default OrganizationResetPassword;
