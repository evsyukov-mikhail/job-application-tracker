import { useUserStore } from "~/stores/user.store";
import type { Route } from "./+types/home";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { JobApplication as IJobApplication } from "~/interfaces/job-application.interface";
import { JobApplication } from "~/atoms/job-application";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Search } from "~/components/search";

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
    <>
      <Search
        searchParamsState={[searchParams, setSearchParams]}
        onSearch={() => jobApplicationQuery.refetch()}
      />
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
    </>
  );
}
