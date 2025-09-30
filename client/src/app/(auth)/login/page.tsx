"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, user, hydrate } = useAuthStore();
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  useEffect(() => {
    if (user) router.replace("/movies");
  }, [user, router]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    await login(data.email, data.password);
  };

  return (
    <div className="mx-auto max-w-sm py-10 px-4 flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
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
          {isSubmitting || loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      <p className="text-sm mt-4">
        Don&apos;t have an account?{" "}
        <Link className="underline" href="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
}
