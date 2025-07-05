import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "~/stores/user.store";
import type { Reminder as IReminder } from "~/interfaces/reminder.interface";
import { Reminder } from "~/atoms/reminder";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router";

export default function Reminders() {
  const navigate = useNavigate();

  const { user, setUser } = useUserStore();

  const headers = { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' };

  const remindersQuery = useQuery({
    queryKey: ['reminders'],
    queryFn: () => fetch(`${import.meta.env.VITE_SERVER_HOST}/reminders`, { headers }).
      then(res => res.json()).
      then(json => {
        if (json.error) throw new Error(json.error)
        else return json as IReminder[] 
      }),
    enabled: false
  });

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }

    setUser(JSON.parse(user!));
  }, []);

  useEffect(() => {
    if (user && user.token) remindersQuery.refetch();
  }, [user]);

  return (
    <>
      <NavLink
        to="/create-reminder"
        onClick={() => {}}
        className="w-1/6 px-6 py-3 bg-green-600 text-center text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out text-base mb-6 mx-auto block"
        aria-label="Create a new reminder"
      >
        Create Reminder
      </NavLink>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {remindersQuery.data?.length ? remindersQuery.data?.map(reminder =>
          <Reminder
            key={reminder._id}
            reminder={reminder} 
          />
        ) : <div>No reminders yet</div>}
      </div>
    </>
  );
}