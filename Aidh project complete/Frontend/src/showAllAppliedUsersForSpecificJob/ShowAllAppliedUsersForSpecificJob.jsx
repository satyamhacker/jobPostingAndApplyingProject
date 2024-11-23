import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Import the delete icon
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination, // Import Pagination from Material-UI
} from "@mui/material";

const ShowAllAppliedUsersForSpecificJob = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(10); // Define the limit for pagination

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found. User may not be authenticated.");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/get-applications-by-job-id/${jobId}?page=${currentPage}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setApplications(data.applications);
          setTotalPages(data.totalPages); // Set total pages from the response
        } else {
          console.error("Failed to fetch applications data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching applications data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId, currentPage, limit]); // Fetch when jobId, currentPage, or limit changes

  const handleDeleteApplicant = async (applicationId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. User may not be authenticated.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/delete-application/${applicationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setApplications((prevApps) =>
          prevApps.filter((app) => app._id !== applicationId)
        );
        console.log("Applicant deleted successfully");
        alert("Applicant deleted successfully");
      } else {
        console.error("Failed to delete applicant:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting applicant:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update current page state
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <Typography variant="h6" align="center">
          Loading...
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Container className="bg-white p-6 rounded shadow-lg max-w-4xl mx-auto mt-4">
        <Typography variant="h4" align="center" gutterBottom>
          Users Data for Job ID: {jobId}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Resume</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length > 0 ? (
                applications.map((application) => (
                  <TableRow key={application._id}>
                    <TableCell>
                      {application.userDetails.firstName} {application.userDetails.lastName}
                    </TableCell>
                    <TableCell>{application.userDetails.email}</TableCell>
                    <TableCell>{application.userDetails.mobile}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          window.open(
                            `http://localhost:3000/uploads/resumes/${application.resumeFilename}`,
                            "_blank"
                          )
                        }
                      >
                        View Resume
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeleteApplicant(application._id)}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Add Pagination */}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
        />
      </Container>
    </div>
  );
};

export default ShowAllAppliedUsersForSpecificJob;
