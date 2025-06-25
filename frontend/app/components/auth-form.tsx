import type { Dispatch, FormEvent, SetStateAction } from "react";
import { FormField } from "~/atoms/form-field";
import type { User } from "~/interfaces/user.interface";

interface Props {
  readonly handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly formState: [User, Dispatch<SetStateAction<User>>];
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: Error | null;
}

export const AuthForm = ({ formState: [formData, setFormData], ...props }: Props) => (
  <form onSubmit={props.handleSubmit}>
    <h2 className="text-center">Sign Up</h2>
    <label className="block text-sm font-medium text-gray-700">
      Username
      <FormField
        type="text"
        value={formData.username}
        onChange={event => setFormData(data => ({ ...data, username: event.target.value }))}
        placeholder="Username"
      />
    </label>
    <label className="block text-sm font-medium text-gray-700">
      Email
      <FormField
        type="email"
        value={formData.email}
        onChange={event => setFormData(data => ({ ...data, email: event.target.value }))}
        placeholder="Email"
      />
    </label>
    <label className="block text-sm font-medium text-gray-700">
      Password
      <FormField
        type="password"
        value={formData.password}
        onChange={event => setFormData(data => ({ ...data, password: event.target.value }))}
        placeholder="Password"
      />
    </label>
    {props.isLoading && <div>Loading...</div>}
    {props.isError && <div>An error occurred: {props.error?.message}</div>}
    <input
      type="submit"
      className="mt-1 w-full border border-gray-300 cursor-pointer sm:text-sm"
      value="Sign Up"
    />
  </form>
)