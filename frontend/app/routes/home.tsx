import { useUserStore } from "~/stores/user.store";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "Job Application Tracker Home", content: "Home" },
  ];
}

export default function Home() {

  const { user } = useUserStore();

  return (
    <div>
      <p>{user.username}, {user.email}, {user.token}</p>
    </div>
  );
}
