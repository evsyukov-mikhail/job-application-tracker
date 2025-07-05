import type { Dispatch, SetStateAction } from "react"

interface Props {
  statusState: [string, Dispatch<SetStateAction<string>>];
  statuses: string[];
}

export const FilterStatus = ({ statusState: [status, setStatus], ...props }: Props) => (
  <div className="mb-6">
    <label htmlFor="statusFilter" className="block font-medium text-sm mb-1 text-gray-700">Filter by Status:</label>
    <select
      id="statusFilter"
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="w-full sm:w-1/2 md:w-1/3 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      aria-label="Filter job applications by status"
    >
      <option value="All">All Statuses</option>
      {props.statuses.map(option =>
        <option key={option} value={option}>
          {option}
        </option>
      )}
    </select>
  </div>
)