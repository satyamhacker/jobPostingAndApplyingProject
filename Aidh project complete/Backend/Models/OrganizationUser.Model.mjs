// models/OrganizationUser.Model.mjs

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['HR', 'Admin', 'Manager'], // Limit roles to specific values
  },
  hrPassword: {
    type: String,
    required: function() {
      return this.role === 'HR';
    },
  },
  managerPassword: {
    type: String, // Defines managerPassword as a string type

    // Sets a conditional requirement for this field.
    // The field is required only if the user's role is 'Manager'.
    required: function() {
      return this.role === 'Manager'; // If role is 'Manager', this field becomes mandatory
    },
  },
  adminPassword: {
    type: String,
    required: function() {
      return this.role === 'Admin';
    },
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Create a User model
const OrganizationUserData = mongoose.model('OrganizationUserData', userSchema);

export default OrganizationUserData;
