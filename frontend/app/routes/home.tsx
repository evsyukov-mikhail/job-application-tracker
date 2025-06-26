import { useUserStore } from "~/stores/user.store";
import type { Route } from "./+types/home";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { JobApplication as IJobApplication } from "~/interfaces/job-application.interface";
import { JobApplication } from "~/atoms/job-application";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "Job Application Tracker Home", content: "Home" },
  ];
}

export default function Home() {
  const { user } = useUserStore();

  const getJobApplications = (): Promise<IJobApplication[]> => {
    const headers = { 'Authorization': `Bearer ${user.token}` };

    return fetch(`${import.meta.env.VITE_SERVER_HOST}/job-applications`, { headers }).then(res => res.json());
  }

  const query = useQuery({
    queryKey: ['jobApplications'],
    queryFn: getJobApplications
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

  return (
    <main className="p-4">
      <h2 className="text-2xl font-bold mb-1">Job Applications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {query.data?.map(jobApplication =>
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
