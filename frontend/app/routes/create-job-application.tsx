import { useState } from "react";

export default function CreateJobApplication() {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    applicationDate: '',
    status: 'Applied',
    notes: '',
  });

  const statusOptions = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

  const handleCancel = () => {}

  const handleSubmit = () => {}

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm mx-auto text-sm">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Create New Job Application</h2>

      <div className="space-y-4 text-gray-700">
        <div>
          <label htmlFor="companyName" className="block font-medium text-sm mb-1">Company Name:</label>
          <input
            type="text"
            id="companyName"
            placeholder="e.g., Google"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="Company Name"
            value={formData.companyName}
            onChange={event => setFormData(state => ({ ...state, companyName: event.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="jobTitle" className="block font-medium text-sm mb-1">Job Title:</label>
          <input
            type="text"
            id="jobTitle"
            placeholder="e.g., Senior Software Engineer"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="Job Title"
            value={formData.jobTitle}
            onChange={event => setFormData(state => ({ ...state, jobTitle: event.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="applicationDate" className="block font-medium text-sm mb-1">Application Date:</label>
          <input
            type="date"
            id="applicationDate"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="Application Date"
            value={formData.applicationDate}
            onChange={event => setFormData(state => ({ ...state, applicationDate: event.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="status" className="block font-medium text-sm mb-1">Status:</label>
          <select
            id="status"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="Select Status"
            value={formData.status}
            onChange={event => setFormData(state => ({ ...state, status: event.target.value }))}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block font-medium text-sm mb-1">Notes:</label>
          <textarea
            id="notes"
            placeholder="Add any relevant notes here..."
            rows={4}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm resize-y min-h-[60px]"
            aria-label="Notes"
            value={formData.notes}
            onChange={event => setFormData(state => ({ ...state, notes: event.target.value }))}
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
            aria-label="Cancel creating new job application"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out text-sm"
            aria-label="Create new job application"
          >
            Create Application
          </button>
        </div>
      </div>
    </form>
  );
}