import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';

const CreateEventForm = () => {
  const [isVirtual, setIsVirtual] = useState(false);
  const [error, setError] = useState(null);
  
  const initialValues = {
    title: '',
    description: '',
    category: '',
    eventDetails: {
      startDate: '',
      endDate: '',
      location: {
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
      },
      maxCapacity: '',
      isVirtual: false,
      meetingLink: ''
    },
    ticketPrice: 0,
    images: [],
    status: 'draft'
  };

  const validate = values => {
    const errors = {};

    // Basic Information validation
    if (!values.title) {
      errors.title = 'Title is required';
    }
    if (!values.description) {
      errors.description = 'Description is required';
    }
    if (!values.category) {
      errors.category = 'Category is required';
    }

    // Event Details validation
    if (!values.eventDetails) {
      errors.eventDetails = {};
    } else {
      const eventDetailsErrors = {};

      if (!values.eventDetails.startDate) {
        eventDetailsErrors.startDate = 'Start date is required';
      }
      if (!values.eventDetails.endDate) {
        eventDetailsErrors.endDate = 'End date is required';
      } else if (values.eventDetails.startDate && new Date(values.eventDetails.endDate) <= new Date(values.eventDetails.startDate)) {
        eventDetailsErrors.endDate = 'End date must be after start date';
      }

      // Location validation
      if (!values.eventDetails.isVirtual) {
        const locationErrors = {};
        if (!values.eventDetails.location.address) {
          locationErrors.address = 'Address is required';
        }
        if (!values.eventDetails.location.city) {
          locationErrors.city = 'City is required';
        }
        if (!values.eventDetails.location.state) {
          locationErrors.state = 'State is required';
        }
        if (!values.eventDetails.location.country) {
          locationErrors.country = 'Country is required';
        }
        if (!values.eventDetails.location.zipCode) {
          locationErrors.zipCode = 'ZIP code is required';
        }
        if (Object.keys(locationErrors).length > 0) {
          eventDetailsErrors.location = locationErrors;
        }
      }

      if (!values.eventDetails.maxCapacity) {
        eventDetailsErrors.maxCapacity = 'Capacity is required';
      } else if (Number(values.eventDetails.maxCapacity) <= 0) {
        eventDetailsErrors.maxCapacity = 'Capacity must be positive';
      }

      if (values.eventDetails.isVirtual && !values.eventDetails.meetingLink) {
        eventDetailsErrors.meetingLink = 'Meeting link is required for virtual events';
      }

      if (Object.keys(eventDetailsErrors).length > 0) {
        errors.eventDetails = eventDetailsErrors;
      }
    }

    // Ticket price validation
    if (values.ticketPrice < 0) {
      errors.ticketPrice = 'Ticket price cannot be negative';
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError(null);
      // Get the user ID from localStorage or your auth state management
      const userId = localStorage.getItem('userId'); // Adjust based on your auth implementation
      
      if (!userId) {
        setError('User not authenticated. Please login first.');
        return;
      }

      // Add organizer information to the values
      const eventData = {
        ...values,
        organizer: {
          userId // Send as a single value, not an array
        }
      };

      const response = await axios.post('http://localhost:8000/api/v1/events', eventData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token for authentication
        }
      });

      if (response.data.success) {
        resetForm();
        alert('Event created successfully!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error creating event. Please try again.';
      setError(errorMessage);
      console.error('Error creating event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Event Title
                  </label>
                  <Field
                    name="title"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Field
                    name="description"
                    as="textarea"
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <Field
                    name="category"
                    as="select"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Social">Social</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Event Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date & Time
                    </label>
                    <Field
                      name="eventDetails.startDate"
                      type="datetime-local"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage name="eventDetails.startDate" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date & Time
                    </label>
                    <Field
                      name="eventDetails.endDate"
                      type="datetime-local"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage name="eventDetails.endDate" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <Field
                      type="checkbox"
                      name="eventDetails.isVirtual"
                      onChange={(e) => {
                        setIsVirtual(e.target.checked);
                        setFieldValue('eventDetails.isVirtual', e.target.checked);
                      }}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">This is a virtual event</span>
                  </label>
                </div>

                {isVirtual ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Meeting Link
                    </label>
                    <Field
                      name="eventDetails.meetingLink"
                      type="url"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage name="eventDetails.meetingLink" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <Field
                        name="eventDetails.location.address"
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <ErrorMessage name="eventDetails.location.address" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <Field
                          name="eventDetails.location.city"
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <ErrorMessage name="eventDetails.location.city" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <Field
                          name="eventDetails.location.state"
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <ErrorMessage name="eventDetails.location.state" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <Field
                          name="eventDetails.location.country"
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <ErrorMessage name="eventDetails.location.country" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          ZIP Code
                        </label>
                        <Field
                          name="eventDetails.location.zipCode"
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <ErrorMessage name="eventDetails.location.zipCode" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Capacity
                    </label>
                    <Field
                      name="eventDetails.maxCapacity"
                      type="number"
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage name="eventDetails.maxCapacity" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ticket Price ($)
                    </label>
                    <Field
                      name="ticketPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage name="ticketPrice" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Event Images</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(event) => {
                    // Handle image upload
                  }}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateEventForm;
