import type { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_META } from "@/models/base";
import RecordedDashboardServer from "./recordedDashboard.server";

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

  return {
    title: `Batch ${slug} - ${DEFAULT_META.title}`,
    description: DEFAULT_META.description,
    keywords: DEFAULT_META.keywords,
    openGraph: {
      title: `Batch ${slug}`,
      description: DEFAULT_META.description,
      images: [
        {
          url: DEFAULT_META.ogImage,
          width: 1200,
          height: 676,
        },
      ],
      type: "website",
      url: DEFAULT_META.url,
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_META.title,
      description: DEFAULT_META.description,
      images: [
        {
          url: DEFAULT_META.ogImage,
          width: 1200,
          height: 676,
        },
      ],
    },
  };
}

// ✅ FIX: Define the page component here to handle params
const RecordedDashboardPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  return (
    <>
      <RecordedDashboardServer slug={slug} />
    </>
  );
};

export default RecordedDashboardPage;
