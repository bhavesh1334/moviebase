"use client";
import { useEffect, useMemo, useState } from "react";
import { MoviesAPI, Movie } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Pagination } from "@/components/ui/Pagination";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, Pencil, Plus } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function MoviesPage() {
  const router = useRouter();
  const { user, hydrate } = useAuthStore();
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ items: Movie[]; total: number }>({
    items: [],
    total: 0,
  });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);
  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user]);

  const load = useMemo(
    () =>
      async (p = page, s = search) => {
        setLoading(true);
        try {
          const res = await MoviesAPI.list({
            page: p,
            limit,
            search: s || undefined,
          });
          console.log(res, "RES");
          setData({ items: res.movies, total: res.pagination.totalMovies });
        } finally {
          setLoading(false);
        }
      },
    [page, limit, search]
  );

  useEffect(() => {
    load();
  }, [page, search, load]);

  // Debounce search input -> search term
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(query);
    }, 400);
    return () => clearTimeout(id);
  }, [query]);

  const onDelete = async (id: string) => {
    await MoviesAPI.remove(id);
    setConfirmId(null);
    load();
  };
  console.log(data, "DATA");
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className="text-lg font-semibold">My Movies</h1>
        <Link href="/movies/create">
          <Button className="gap-2">
            <Plus size={16} /> Add Movie
          </Button>
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Input
          placeholder="Search by title or year"
          className="w-full"
          value={query}
          onChange={(e) => {
            setPage(1);
            setQuery(e.target.value);
          }}
        />
      </div>
      {loading ? (
        <p className="my-12">Loading...</p>
      ) : (
        <div className="p-6 px-0">
          {data?.items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/window.svg"
                  alt="Empty"
                  className="w-16 h-16 opacity-70"
                />
              </div>
              <h2 className="text-lg font-medium mb-2">No movies yet</h2>
              <p className="opacity-70 mb-6 max-w-sm">
                Start building your collection by adding your first movie.
              </p>
              <Link href="/movies/create">
                <Button className="gap-2">
                  <Plus size={16} /> Add Movie
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data?.items?.map((m) => (
                <Card key={m._id} className="group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m?.poster || "/window.svg"}
                        alt={m?.title}
                        className="h-64 w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                      <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
                        <Link
                          href={`/movies/${m._id}/edit`}
                          className="p-2 rounded cursor-pointer border border-foreground/20 bg-background/80 hover:scale-110 transition-all duration-300"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => setConfirmId(m._id)}
                          className="p-2 rounded cursor-pointer border border-foreground/20 bg-background/80 hover:scale-110 transition-all duration-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="font-medium line-clamp-1">{m?.title}</div>
                      <div className="text-sm opacity-70">
                        {m.publishingYear}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {data?.items?.length > 0 && (
            <Pagination
              page={page}
              limit={limit}
              total={data.total}
              onPageChange={setPage}
            />
          )}
        </div>
      )}

      <Dialog
        open={!!confirmId}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Delete movie?"
        action={
          <>
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmId && onDelete(confirmId)}
            >
              Delete
            </Button>
          </>
        }
      >
        This action cannot be undone.
      </Dialog>
    </div>
  );
}
