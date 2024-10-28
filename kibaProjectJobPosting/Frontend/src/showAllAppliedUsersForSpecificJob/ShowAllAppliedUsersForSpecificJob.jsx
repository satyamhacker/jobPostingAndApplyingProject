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
} from "@mui/material";

const ShowAllAppliedUsersForSpecificJob = () => {
  const { jobId } = useParams();
  const [usersData, setUsersData] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found. User may not be authenticated.");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/get-applications-by-job-id/${jobId}`,
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
          setUsersData(data.users);
          setApplications(data.applications);
        } else {
          console.error("Failed to fetch users data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, [jobId]);

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
        setUsersData((prevUsers) =>
          prevUsers.filter((user) => user._id !== applicationId)
        );
        console.log("Applicant deleted successfully");
        alert("Applicant deleted successfully");
        window.location.reload();
      } else {
        console.error("Failed to delete applicant:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting applicant:", error);
    }
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
              {usersData.length > 0 ? (
                usersData.map((applicant) => (
                  <TableRow key={applicant._id}>
                    <TableCell>
                      {applicant.firstName} {applicant.lastName}
                    </TableCell>
                    <TableCell>{applicant.email}</TableCell>
                    <TableCell>{applicant.mobile}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          window.open(
                            `http://localhost:3000/uploads/resumes/${
                              applications.find(
                                (app) => app.userId === applicant._id
                              ).resumeFilename
                            }`,
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
                        onClick={() =>
                          handleDeleteApplicant(
                            applications.find(
                              (app) => app.userId === applicant._id
                            )._id
                          )
                        }
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
      </Container>
    </div>
  );
};

export default ShowAllAppliedUsersForSpecificJob;
