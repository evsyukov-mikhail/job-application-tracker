import { useMutation } from "@tanstack/react-query";
import { useState, type ChangeEvent } from "react";
import type { JobApplication as IJobApplication } from "~/interfaces/job-application.interface"
import { useUserStore } from "~/stores/user.store";

interface Props {
  jobApplication: IJobApplication;
}

export const JobApplication = (props: Props) => {

  const { user } = useUserStore();

  const [status, setStatus] = useState(props.jobApplication.status);
  const { _id, companyName, jobTitle, applicationDate, notes } = props.jobApplication;

  const statusOptions = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

  const headers = { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' };
  const mutation = useMutation({
    mutationFn: (status: string) =>
      fetch(`${import.meta.env.VITE_SERVER_HOST}/job-applications/${_id}`, {
        method: 'PUT', headers, body: JSON.stringify({ status })
      }).
        then(res => res.json()).
        then(json => { if (json.message) throw new Error(json.message) }),
  })

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  }

  const handleSaveStatus = () => {
    mutation.mutate(status, {
      onError: () => console.log('Got an error'),
    })
  }

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-xl w-full max-w-md mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
        {jobTitle}
        <span className="block text-lg sm:text-xl font-semibold text-gray-600 mt-1">at {companyName}</span>
      </h2>

      <div className="space-y-4 text-gray-700">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center pb-2 border-b border-gray-200">
          <span className="font-medium text-sm sm:text-base mb-1 sm:mb-0">Applied On:</span>
          <span className="text-sm sm:text-base">{applicationDate}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center pb-2 border-b border-gray-200">
          <span className="font-medium text-sm sm:text-base mb-2 sm:mb-0">Current Status:</span>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            {status}
            <select
              value={status}
              onChange={handleStatusChange}
              className="block w-full sm:w-auto px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              aria-label="Update job status"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveStatus}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out text-sm sm:text-base"
            aria-label="Save status update"
          >
            Save Status
          </button>
        </div>
        {mutation.isError && <div>{mutation.error.message}</div>}

        <div>
          <p className="font-medium text-sm sm:text-base mb-1">Notes:</p>
          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800 border border-gray-200 min-h-[60px] max-h-[150px] overflow-y-auto">
            {notes || "No notes provided."}
          </div>
        </div>
      </div>
    </div>
  );
}