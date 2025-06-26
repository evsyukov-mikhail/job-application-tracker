import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "~/stores/user.store";
import type { Reminder as IReminder } from "~/interfaces/reminder.interface";
import { Reminder } from "~/atoms/reminder";
import { useEffect } from "react";
import { useNavigate } from "react-router";

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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {remindersQuery.data?.map(reminder =>
        <Reminder
          key={reminder._id}
          reminder={reminder} 
        />
      )}
    </div>
  );
}