import type { Reminder as IReminder } from "~/interfaces/reminder.interface"

interface Props {
  reminder: IReminder;
}

export const Reminder = (props: Props) => (
  <div className="bg-white p-4 rounded-lg shadow-md text-sm">
    <h3 className="text-lg font-semibold text-gray-800 mb-1">{props.reminder.title}</h3>
    <p className="text-gray-600">Due: {new Date(props.reminder.date).toLocaleDateString()}</p>
  </div>
)