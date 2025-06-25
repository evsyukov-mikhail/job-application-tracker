import { useUserStore } from "~/stores/user.store";
import type { Route } from "./+types/home";
import { useQuery } from "@tanstack/react-query";
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

  return (
    <main className="p-4">
      <h2>Job Applications</h2>
      <div className="flex flex-wrap">
        {query.data?.map(jobApplication => <JobApplication key={jobApplication._id} jobApplication={jobApplication} />)}
      </div>
    </main>
  );
}
