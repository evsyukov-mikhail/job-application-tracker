import type { Dispatch, SetStateAction } from "react"
import type { SearchParams } from "~/interfaces/search-params"

interface Props {
  searchParamsState: [SearchParams, Dispatch<SetStateAction<SearchParams>>];
  onSearch: () => void;
}

export const Search = ({ searchParamsState: [searchParams, setSearchParams], ...props }: Props) => (
  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
    <input
      type="text"
      placeholder="Search Job Title..."
      value={searchParams.jobTitle}
      onChange={event => setSearchParams(state => ({ ...state, jobTitle: event.target.value }))}
      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      aria-label="Search job title"
    />
    <input
      type="text"
      placeholder="Search Company Name..."
      value={searchParams.companyName}
      onChange={event => setSearchParams(state => ({ ...state, companyName: event.target.value }))}
      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      aria-label="Search company name"
    />
    <button
      onClick={props.onSearch}
      className="px-3 py-1.5 bg-gray-700 text-white rounded-md shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 text-sm w-full sm:w-auto"
      aria-label="Perform search"
    >
      Search
    </button>
  </div>
)