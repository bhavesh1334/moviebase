"use client";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SingleFileDropzone } from "@/components/Dropzone";
import { useState } from "react";
import { MoviesAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  title: z.string().min(1),
  publishingYear: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 10),
});
type FormValues = z.infer<typeof schema>;

export default function CreateMoviePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
  });

  const onFile = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await MoviesAPI.create({
      title: data.title,
      publishingYear: data.publishingYear,
      poster: file ?? undefined,
    });
    router.push("/movies");
  };

  return (
    <div className=" w-full max-w-6xl mx-auto p-4">
      <h1 className="text-lg font-semibold mb-4">Add Movie</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div>
          <label className="block mb-1">Title</label>
          <Input
            invalid={!!errors.title}
            {...register("title")}
            placeholder="The Matrix"
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Publishing Year</label>
          <Input
            type="number"
            placeholder="1999"
            invalid={!!errors.publishingYear}
            {...register("publishingYear")}
          />
          {errors.publishingYear && (
            <p className="text-sm text-red-600 mt-1">
              {errors.publishingYear.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1">Poster</label>
          <SingleFileDropzone onFile={onFile} previewUrl={preview} />
        </div>
        <Button disabled={isSubmitting} className="cursor-pointer w-full mt-4">
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
