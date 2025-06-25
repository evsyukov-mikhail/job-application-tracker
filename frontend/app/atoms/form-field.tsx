import type { ChangeEventHandler } from "react";

interface Props {
  readonly type: string;
  readonly placeholder: string;
  readonly value: string;
  readonly onChange: ChangeEventHandler<HTMLInputElement>;
}

export const FormField = (props: Props) => (
  <input
    type={props.type}
    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
    value={props.value}
    onChange={props.onChange}
    placeholder={props.placeholder}
    required
  />
)