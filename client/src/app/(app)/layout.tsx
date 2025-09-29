"use client";
import Link from "next/link";
import { ReactNode, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, hydrate, logout } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-foreground/20 sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/movies" className="font-semibold text-lg">
            MovieBase
          </Link>
          <div className="flex items-center gap-2">
            {/* Future: enable create button when needed */}
            {/* <Link href="/movies/create">
              <Button className="gap-2">
                <Plus size={16} /> Add
              </Button>
            </Link> */}
            <Button
              variant="outline"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="pt-8">{children}</main>
    </div>
  );
}
