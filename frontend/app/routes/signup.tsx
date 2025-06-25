import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

export default function Signup() {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const mutation = useMutation({
    mutationFn: (body: { username: string, email: string, password: string }) =>
      fetch(`${process.env.SERVER_HOST}/auth/signup`, { method: 'POST', body: JSON.stringify(body) }).
        then(res => res.json()),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate({ ...formData });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <label className="block text-sm font-medium text-gray-700">
          Username
          <input
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            value={formData.username}
            onChange={event => setFormData(data => ({ ...data, username: event.target.value }))}
            placeholder="Username"
            required
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            value={formData.email}
            onChange={event => setFormData(data => ({ ...data, email: event.target.value }))}
            placeholder="Email"
            required
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Password
          <input
            type="password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            value={formData.password}
            onChange={event => setFormData(data => ({ ...data, password: event.target.value }))}
            placeholder="Password"
            required
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