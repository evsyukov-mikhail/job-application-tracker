import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("/reminders", "routes/reminders.tsx"),
    route("/create-job-application", "routes/create-job-application.tsx"),
    route("/create-reminder", "routes/create-reminder.tsx"),
  ]),
  
  route("/signup", "routes/signup.tsx"),
  route("/login", "routes/login.tsx"),
] satisfies RouteConfig;
