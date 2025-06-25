import { useUserStore } from "~/stores/user.store";
import type { Route } from "./+types/home";
import { useQuery } from "@tanstack/react-query";
import type { JobApplication } from "~/interfaces/job-application.interface";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "Job Application Tracker Home", content: "Home" },
  ];
}

export default function Home() {

  const { user } = useUserStore();

  const getJobApplications = (): Promise<JobApplication[]> => {
    const headers = { 'Authorization': `Bearer ${user.token}` };

    return fetch(`${import.meta.env.VITE_SERVER_HOST}/job-applications`, { headers }).then(res => res.json());
  }

  const query = useQuery({
    queryKey: ['jobApplications'],
    queryFn: getJobApplications
  });

  return (
    <div>
      <p>{user.username}, {user.email}, {user.token}</p>
    </div>
  );
}
