import type { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_META } from "@/models/base";
import RecordedClassess from "./recordedClassess.server";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  // Ideally, you might want to fetch the meeting title here for a better metadata title
  // For now, using the slug/ID is acceptable or a generic title
  const title = `Class Details | ${DEFAULT_META.title}`;

  return {
    title,
    description: `Recorded class details for ID ${slug}`,
    openGraph: {
      title,
      description: `Recorded class details for ID ${slug}`,
      images: [
        {
          url: DEFAULT_META.ogImage,
          width: 1200,
          height: 676,
        },
      ],
      type: "website",
      url: `${DEFAULT_META.url}/recorded-classess/${slug}`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <RecordedClassess slug={slug} />;
}
