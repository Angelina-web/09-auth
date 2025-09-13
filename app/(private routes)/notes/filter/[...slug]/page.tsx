import css from "./NotesPage.module.css";
import NoteListClient from "./Notes.client";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/api";
import { Metadata } from "next";

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug[0] === "All" ? "All Notes" : `${slug[0]} Notes`,
    description:
      slug[0] === "All" ? "All notes" : `Notes tagged with ${slug[0]}`,
    openGraph: {
      title: slug[0] === "All" ? "All Notes" : `${slug[0]} Notes`,
      description:
        slug[0] === "All" ? "All notes" : `Notes tagged with ${slug[0]}`,
      url: `https://notehub.example.com/notes/${slug.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: slug[0] === "All" ? "All Notes" : `${slug[0]} Notes`,
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug?.[0] ?? "";
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, 1],
    queryFn: () => fetchNotes(1, tag),
  });

  return (
    <div className={css.app}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteListClient tag={tag} />
      </HydrationBoundary>
    </div>
  );
}
