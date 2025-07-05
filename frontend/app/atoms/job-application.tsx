import { useState, type ChangeEvent } from "react";
import type { JobApplication as IJobApplication } from "~/interfaces/job-application.interface"

interface Props {
  jobApplication: IJobApplication;
  onSaveStatus: (status: string) => void;
  onDelete: () => void;
  isError: boolean;
  error: Error | null;
}

export const JobApplication = (props: Props) => {
  const [status, setStatus] = useState(props.jobApplication.status);
  const { companyName, jobTitle, applicationDate, notes } = props.jobApplication;

  const statusOptions = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm mx-auto text-sm">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-3">
        {jobTitle}
        <span className="block text-base font-semibold text-gray-600 mt-0.5">at {companyName}</span>
      </h2>

      <div className="space-y-3 text-gray-700">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="font-medium">Applied On:</span>
          <span>{applicationDate}</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-2">
          <span className="font-medium mb-1 sm:mb-0">Current Status:</span>
          <div className="flex items-center space-x-2">
            <span>{status}</span>
            <select
              value={status}
              onChange={handleStatusChange}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm"
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

        <div className="flex justify-end pt-2 gap-2">
          <button
            onClick={props.onDelete}
            className="px-3 py-1.5 bg-red-600 text-white rounded-md shadow hover:bg-red-700 text-sm"
            aria-label="Delete job application"
          >
            Delete
          </button>
          <button
            onClick={() => props.onSaveStatus(status)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 text-sm"
            aria-label="Save status update"
          >
            Save Status
          </button>
        </div>
        {props.isError && <div>{props.error?.message}</div>}

        <div>
          <p className="font-medium mb-1">Notes:</p>
          <div className="bg-gray-50 p-2 rounded-md border border-gray-200 min-h-[50px] max-h-[120px] overflow-y-auto">
            {notes || "No notes provided."}
          </div>
        </div>
      </div>
    </div>
  );
}