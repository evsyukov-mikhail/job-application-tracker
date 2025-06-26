import { useUserStore } from "~/stores/user.store";
import type { Route } from "./+types/home";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { JobApplication as IJobApplication } from "~/interfaces/job-application.interface";
import { JobApplication } from "~/atoms/job-application";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "Job Application Tracker Home", content: "Home" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const [searchParams, setSearchParams] = useState({
    companyName: '',
    jobTitle: '',
  });

  const [searchQuery, setSearchQuery] = useState('');

  const jobApplicationQuery = useQuery({
    queryKey: ['jobApplications'],
    queryFn: () => fetch(`${import.meta.env.VITE_SERVER_HOST}/job-applications${searchQuery}`, {
      headers: { 'Authorization': `Bearer ${user.token}` },
    }).
      then(res => res.json() as Promise<IJobApplication[]>),
    enabled: false,
  });

  const headers = { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) =>
      fetch(`${import.meta.env.VITE_SERVER_HOST}/job-applications/${id}`, {
        method: 'PUT', headers, body: JSON.stringify({ status })
      }).
        then(res => res.json()).
        then(json => { if (json.error) throw new Error(json.error) }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`${import.meta.env.VITE_SERVER_HOST}/job-applications/${id}`, { method: 'DELETE', headers })
        .then(res => res.json())
        .then(json => { if (json.error) throw new Error(json.error) }),
  });

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }

    setUser(JSON.parse(user!));
  }, []);

  useEffect(() => {
    if (user && user.token) jobApplicationQuery.refetch();
  }, [user]);

  useEffect(() => {
    const { companyName, jobTitle } = searchParams;
    const queryParams = [];

    if (companyName) {
      queryParams.push(`companyName=${companyName}`);
    }

    if (jobTitle) {
      queryParams.push(`jobTitle=${jobTitle}`);
    }

    setSearchQuery(queryParams.length ? `?${queryParams.join('&')}` : '');
  }, [searchParams]);

  return (
    <main className="p-4">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
      <input
        type="text"
        placeholder="Search Job Title..."
        value={searchParams.companyName}
        onChange={event => setSearchParams(state => ({ ...state, companyName: event.target.value }))}
        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        aria-label="Search job title"
      />
      <input
        type="text"
        placeholder="Search Company Name..."
        value={searchParams.jobTitle}
        onChange={event => setSearchParams(state => ({ ...state, jobTitle: event.target.value }))}
        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        aria-label="Search company name"
      />
    </div>
      <h2 className="text-2xl font-bold mb-1">Job Applications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {jobApplicationQuery.data?.map(jobApplication =>
          <JobApplication
            key={jobApplication._id}
            jobApplication={jobApplication}
            onSaveStatus={(status: string) => updateStatusMutation.mutate({ id: jobApplication._id, status })}
            onDelete={() => deleteMutation.mutate(jobApplication._id)}
            isError={updateStatusMutation.isError}
            error={updateStatusMutation.error}
          />
        )}
      </div>
    </main>
  );
}
