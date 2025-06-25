import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { FormField } from "~/atoms/form-field";
import type { AuthResult } from "~/interfaces/auth-result.interface";
import type { User } from "~/interfaces/user.interface";

export default function Login() {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const mutation = useMutation({
    mutationFn: (body: User): Promise<AuthResult> => 
      fetch(`${import.meta.env.VITE_SERVER_HOST}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      }).
        then(res => res.json()),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate({ ...formData }, {
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error),
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
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
            value={formData.email}
            onChange={event => setFormData(data => ({ ...data, password: event.target.value }))}
            placeholder="Password"
          />
        </label>
        {mutation.isPending && <div>Loading...</div>}
        {mutation.isError && <div>An error occurred: {mutation.error.message}</div>}
        <input
          type="submit"
          className="cursor-pointer"
          value="Sign Up"
        />
      </form>
    </main>
  );
}