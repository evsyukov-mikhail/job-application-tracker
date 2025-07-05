import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { redirect, useNavigate } from "react-router";
import { AuthForm } from "~/components/auth-form";
import type { AuthResult } from "~/interfaces/auth-result.interface";
import type { User } from "~/interfaces/user.interface";
import { useUserStore } from "~/stores/user.store";

export default function Login() {

  const navigate = useNavigate();

  const { setUser } = useUserStore();

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
      onSuccess: (data) => {
        setUser(data);
        sessionStorage.setItem('user', JSON.stringify(data));

        navigate('/');
      },
      onError: (error) => console.error(error),
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <AuthForm
        title="Log In"
        handleSubmit={handleSubmit}
        formState={[formData, setFormData]}
        isLoading={mutation.isPending}
        isError={mutation.isError}
        error={mutation.error}
      />
    </main>
  );
}