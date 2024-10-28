import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  TextField,
  Stack,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { FaMapMarkerAlt, FaBriefcase, FaClock } from "react-icons/fa";
import ResumeUpload from "../resumeUpload/ResumeUpload"; // Import ResumeUpload component


const ShowAllActiveJobsForJobSeekers = () => {
  const navigate = useNavigate();
  const [activeJobs, setActiveJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null); // Track the selected job for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state

  // Fetch active jobs on component mount
  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/get-active-jobs", {
          method: "GET",
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Move this inside the headers object
          },
        });

        if (response.ok) {
          const jobs = await response.json();
          setActiveJobs(jobs);
        } else {
          console.error("Failed to fetch active jobs");
        }
      } catch (error) {
        console.error("Error fetching active jobs:", error);
      }
    };

    fetchActiveJobs();
  }, []);

  // Handle search filtering
  const filteredJobs = activeJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle modal open and close
  const handleOpenModal = (job) => {
    setSelectedJob(job); // Set the selected job
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedJob(null); // Clear the selected job
  };


  

  return (
    <Box
      sx={{ backgroundColor: "#0e1b2a", minHeight: "100vh", color: "white" }}
    >
      {/* Header / Navbar */}
      <AppBar
        position="static"
        sx={{ background: "transparent", boxShadow: "none" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#48b0a5" }}
          >
            AID-IPH
          </Typography>
          <Box>
            <Button color="inherit" sx={{ color: "white" }}>
              For Job Seekers
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              sx={{ ml: 2, borderColor: "white", color: "white" }}
              onClick={() => navigate("/auth/Organization-signup")}
            >
              Organization Signup
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h2" fontWeight="700" gutterBottom>
          Find Your <br />
          <span style={{ color: "#4fc3f7" }}>job & make sure goal.</span>
        </Typography>
        <Typography variant="h6" gutterBottom>
          Your dream job is waiting for you.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3, px: 5, borderRadius: "30px" }}
          startIcon={<PlayArrowIcon />}
          onClick={() => navigate("/auth/register")}
        >
          Get Started
        </Button>
      </Container>

      {/* Search Bar */}
      <Container maxWidth="lg" sx={{ mt: 8, textAlign: "center" }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          sx={{
            mb: 4,
            backgroundColor: "white",
            borderRadius: "4px",
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Container>

      {/* Active Jobs Section */}
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{ color: "#48b0a5", textAlign: "center", mb: 4 }}
        >
          Available Jobs
        </Typography>
        <Grid container spacing={3}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <Card sx={{ backgroundColor: "#1a2b3c", color: "white" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Job Valid Till:{" "}
                      {job.validTill
                        ? new Date(job.validTill).toISOString().split("T")[0]
                        : "N/A"}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ mb: 2, justifyContent: "space-between" }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FaMapMarkerAlt style={{ marginRight: 8 }} />
                        <Typography variant="body2">{job.location}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FaBriefcase style={{ marginRight: 8 }} />
                        <Typography variant="body2">
                          {job.experience} years
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FaClock style={{ marginRight: 8 }} />
                        <Typography variant="body2">
                          {job.employmentType}
                        </Typography>
                      </Box>
                    </Stack>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenModal(job)}
                    >
                      Apply
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography
              variant="body1"
              sx={{ color: "gray", textAlign: "center", width: "100%" }}
            >
              Please Sign in to see the jobs list.....
            </Typography>
          )}
        </Grid>
      </Container>

      {/* Modal for Job Details */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={isModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            {selectedJob && (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Job Title: {selectedJob.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Job Description: {selectedJob.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Role: {selectedJob.role}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Skills: {selectedJob.skills}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Requirements: {selectedJob.requirements}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Salary: ${selectedJob.salary}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  EmploymentType: {selectedJob.employmentType}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Experience Required: {selectedJob.experience} years
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Job Location: {selectedJob.location}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Job Location: {selectedJob.location}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Job Status: {selectedJob.status}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Job Apply Last Date:{" "}
                  {new Date(selectedJob.validTill).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>

                <ResumeUpload jobId={selectedJob._id} /> {/* ResumeUpload Component */}
                <br/>


                
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ShowAllActiveJobsForJobSeekers;
