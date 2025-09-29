"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function Home() {
  const router = useRouter();
  const { user, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (user) router.replace("/movies");
    else router.replace("/login");
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="text-sm opacity-60">Redirecting…</span>
    </div>
  );
}
