import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Container, Row, Col, Form, Button, Modal, Dropdown } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa'; // Three-dot icon
import { MdLocationOn, MdWork, MdDateRange } from 'react-icons/md'; // Icons for fields
import { BsBriefcaseFill, BsCalendarDate } from 'react-icons/bs'; // More Icons for styling
import '../css/JobList.css'; // Additional CSS for styling

const JobList = () => {

  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  


  // Employment type options
  const employmentTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  // Experience options (1 to 10 years)
  const experienceOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  // Status options
  const statusOptions = ['Active', 'Inactive'];

  // Fetch jobs from the API
  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/get-jobs-by-organizationId', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
      } else {
        alert('Failed to fetch jobs. Please Sign to see Job list and To Add job');
        navigate("/auth/organization-login");
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.role.toLowerCase().includes(query) ||
        job.skills.toLowerCase().includes(query)
    );

    setFilteredJobs(filtered);
  };

  const handleShowModal = (job) => {
    setCurrentJob(job);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No authorization token found. Please log in.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/update-job/${currentJob._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: currentJob.title,
          role: currentJob.role,
          location: currentJob.location,
          experience: currentJob.experience,
          validTill: currentJob.validTill,
          employmentType: currentJob.employmentType,
          skills: currentJob.skills,
          description: currentJob.description,
          requirements: currentJob.requirements,
          salary: currentJob.salary,
          status: currentJob.status,
        }),
      });

      if (response.ok) {
        const updatedJob = await response.json();
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job))
        );
        setFilteredJobs((prevFilteredJobs) =>
          prevFilteredJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job))
        );
        alert('Job details updated successfully!');
        setShowModal(false);
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating job:', error);
      alert('An error occurred while updating the job.');
    }
  };

  const handleDelete = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No authorization token found. Please log in.');
        return;
      }

      const response = await fetch(`http://localhost:3000/delete-job/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Job deleted successfully!');
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        setFilteredJobs((prevFilteredJobs) => prevFilteredJobs.filter((job) => job._id !== jobId));
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('An error occurred while deleting the job.');
    }
  };

  // Helper function to format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Helper function to format the date for <input type="date" />
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const handleShowAllUsersAppliedForThisJob = (jobId) => {
    console.log("jobId",jobId);
    navigate(`/organization/show-all-applied-users/${jobId}`);
  }

  return (
    <Container className="mt-5 bg-black">
      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by title, role, or skills..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </Form.Group>

      <Row>
        {filteredJobs.map((job) => (
          <Col key={job._id} md={4} className="mb-4">
            <Card className="h-100 job-card bg-dark text-white">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title>{job.title}</Card.Title>
                  <Dropdown>
                    <Dropdown.Toggle as="div" className="text-white">
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleShowModal(job)}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDelete(job._id)}>Delete</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleShowAllUsersAppliedForThisJob(job._id)}>Show Applied Users</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <Card.Text className="mt-3">
                  <div className="job-detail">
                    <BsBriefcaseFill className="icon" /> <strong>Role:</strong>{' '}
                    <span>{job.role}</span>
                  </div>
                  <div className="job-detail">
                    <MdWork className="icon" /> <strong>Employment Type:</strong>{' '}
                    <span>{job.employmentType}</span>
                  </div>
                  <div className="job-detail">
                    <BsCalendarDate className="icon" /> <strong>Experience:</strong>{' '}
                    <span>{job.experience} years</span>
                  </div>
                  <div className="job-detail">
                    <MdLocationOn className="icon" /> <strong>Location:</strong>{' '}
                    <span>{job.location}</span>
                  </div>
                  <div className="job-detail">
                    <MdDateRange className="icon" /> <strong>Valid Till:</strong>{' '}
                    <span>{formatDate(job.validTill)}</span>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {currentJob && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Job - {currentJob.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={currentJob.title}
                  onChange={(e) => setCurrentJob({ ...currentJob, title: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={currentJob.role}
                  onChange={(e) => setCurrentJob({ ...currentJob, role: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={currentJob.location}
                  onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Experience (Years)</Form.Label>
                <Form.Select
                  value={currentJob.experience}
                  onChange={(e) => setCurrentJob({ ...currentJob, experience: e.target.value })}
                >
                  <option>Select Experience</option>
                  {experienceOptions.map((exp) => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Valid Till</Form.Label>
                <Form.Control
                  type="date"
                  value={formatDateForInput(currentJob.validTill)}
                  onChange={(e) => setCurrentJob({ ...currentJob, validTill: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Employment Type</Form.Label>
                <Form.Select
                  value={currentJob.employmentType}
                  onChange={(e) => setCurrentJob({ ...currentJob, employmentType: e.target.value })}
                >
                  <option>Select Employment Type</option>
                  {employmentTypeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Skills</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={currentJob.skills}
                  onChange={(e) => setCurrentJob({ ...currentJob, skills: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  defaultValue={currentJob.description}
                  onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Requirements</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  defaultValue={currentJob.requirements}
                  onChange={(e) => setCurrentJob({ ...currentJob, requirements: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="number"
                  defaultValue={currentJob.salary}
                  onChange={(e) => setCurrentJob({ ...currentJob, salary: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={currentJob.status}
                  onChange={(e) => setCurrentJob({ ...currentJob, status: e.target.value })}
                >
                  <option>Select Status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default JobList;
