"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function SignUpPage() {
  const router = useRouter();
  const { register: signup, loading, error, user, hydrate } = useAuthStore();
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user) router.replace("/movies");
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    await signup(data.name, data.email, data.password);
  };

  return (
    <div className="mx-auto max-w-sm py-10 flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div>
          <label className="block mb-1">Name</label>
          <Input
            placeholder="John Doe"
            invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <Input
            type="password"
            placeholder="••••••"
            invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button disabled={isSubmitting || loading} className="w-full">
          {isSubmitting || loading ? "Creating..." : "Create account"}
        </Button>
      </form>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      <p className="text-sm mt-4">
        Already have an account?{" "}
        <Link className="underline" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
