import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import JobList from './ShowJobDetail';

const AddJob = () => {
  const [showModal, setShowModal] = useState(false);
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    employmentType: 'Full-time',
    experience: '1',
    role: '',
    skills: '',
    requirements: '',
    location: '',
    validTill: '',
    salary: '',
    status: 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch('http://localhost:3000/add-job', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Move this inside the headers object
        },
        body: JSON.stringify(jobData),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Job added successfully!');
        setShowModal(false);
        setJobData({
          title: '',
          description: '',
          employmentType: 'Full-time',
          experience: '1',
          role: '',
          skills: '',
          requirements: '',
          location: '',
          validTill: '',
          salary: '',
          status: 'Active',
        }); // Reset fields
        // Consider adding a function to refresh the job list here
        window.location.reload();
      } else {
        alert(data.message || 'Error adding job');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Error adding job. Please try again.');
    }
  };

  return (
    <div className="text-center mt-5 bg-black">
      <Button
        style={{ backgroundColor: 'white', color: 'black' }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
        onClick={() => setShowModal(true)}
      >
        + Add Job
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="e.g., Software Engineer"
                value={jobData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="e.g., Responsible for building applications..."
                value={jobData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formEmploymentType">
                  <Form.Label>Employment Type</Form.Label>
                  <Form.Select
                    name="employmentType"
                    value={jobData.employmentType}
                    onChange={handleChange}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Temporary">Temporary</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formExperience">
                  <Form.Label>Experience (Years)</Form.Label>
                  <Form.Select
                    name="experience"
                    value={jobData.experience}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formRole" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                placeholder="e.g., Backend Developer"
                value={jobData.role}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formSkills" className="mb-3">
              <Form.Label>Skills</Form.Label>
              <Form.Control
                type="text"
                name="skills"
                placeholder="e.g., Node.js, React"
                value={jobData.skills}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formRequirements" className="mb-3">
              <Form.Label>Requirements</Form.Label>
              <Form.Control
                type="text"
                name="requirements"
                placeholder="e.g., Strong problem-solving skills"
                value={jobData.requirements}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formLocation" className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder="e.g., San Francisco, CA"
                value={jobData.location}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formValidTill" className="mb-3">
              <Form.Label>Opening Valid Till</Form.Label>
              <Form.Control
                type="date"
                name="validTill"
                value={jobData.validTill}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formSalary" className="mb-3">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="number"
                name="salary"
                placeholder="e.g., 60000"
                value={jobData.salary}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formStatus" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={jobData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Add Job
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <JobList />
    </div>
  );
};

export default AddJob;
