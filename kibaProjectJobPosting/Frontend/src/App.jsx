// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LogoutButton from './logOutButton/LogOutButton'; // Adjust the path if needed

// Importing all your components
import LandingPage from '../src/LandingPage/LandingPage';
import Register from '../src/auth/Register';
import Login from '../src/auth/Login';
import ResetPassword from './auth/ResetPassword';
import Signup from "../src/organizationAuth/Signup";
import OrganizationLogin from './organizationAuth/Login';
import OrganizationResetPassword from './organizationAuth/OrganizationResetPassword';
import AddJob from './organizationJobPosting/AddJobDetail';
import ShowAllActiveJobsForJobSeekers from './showAllActiveJobsForJobSeekers/ShowAllActiveJobsForJobSeekers';
import ShowAllAppliedUsersForSpecificJob from './showAllAppliedUsersForSpecificJob/ShowAllAppliedUsersForSpecificJob';

function App() {
  return (
    <>

      {/* Header with the Logout button */}
      <header style={{ backgroundColor: '#333', padding: '10px', textAlign: 'right' }}>
        <LogoutButton /> {/* Logout button will appear on all pages */}
      </header>

      {/* Main content with routes */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/applicant-login" element={<Login />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/organization-signup" element={<Signup />} />
          <Route path="/auth/organization-login" element={<OrganizationLogin />} />
          <Route path="/auth/organization-reset-password" element={<OrganizationResetPassword />} />
          <Route path="/admin/add-job" element={<AddJob />} />
          <Route path="/job-seekers/show-all-active-jobs" element={<ShowAllActiveJobsForJobSeekers />} />
          <Route path="/organization/show-all-applied-users/:jobId" element={<ShowAllAppliedUsersForSpecificJob />} />
        </Routes>
      </div>
      </>

  );
}

export default App;
