import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "Job Application Tracker Home", content: "Home" },
  ];
}

export default function Home() {
  return <>Home</>;
}
