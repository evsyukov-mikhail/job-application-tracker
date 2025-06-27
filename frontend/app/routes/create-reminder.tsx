import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router";
import type { CreateReminder } from "~/interfaces/create-reminder.interface";
import { useUserStore } from "~/stores/user.store";

export default function CreateReminder() {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [formData, setFormData] = useState<CreateReminder>({
    title: '',
    date: '',
  });

  const headers = { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' };
  const mutation = useMutation({
    mutationFn: (reminder: CreateReminder) =>
      fetch(`${import.meta.env.VITE_SERVER_HOST}/reminders`, {
        method: 'POST', headers, body: JSON.stringify({ ...reminder, date: new Date(reminder.date).toUTCString() }),
      })
        .then(res => res.json())
        .then(json => {
          if (json.error) throw new Error(json.message.join(', '))
          else navigate('/');
        }),
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm mx-auto text-sm">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Create New Reminder</h2>

      <div className="space-y-4 text-gray-700">
        <div>
          <label htmlFor="reminderTitle" className="block font-medium text-sm mb-1">Reminder Title:</label>
          <input
            type="text"
            id="reminderTitle"
            placeholder="e.g., Follow up with recruiter"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="Reminder Title"
            value={formData.title}
            onChange={event => setFormData(state => ({ ...state, title: event.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="reminderDate" className="block font-medium text-sm mb-1">Due Date:</label>
          <input
            type="date"
            id="reminderDate"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="Reminder Due Date"
            value={formData.date}
            onChange={event => setFormData(state => ({ ...state, date: event.target.value }))}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <NavLink
            to="/"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
            aria-label="Cancel creating new reminder"
          >
            Cancel
          </NavLink>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out text-sm"
            aria-label="Create new reminder"
          >
            Create Reminder
          </button>
        </div>
      </div>
    </form>
  );
}