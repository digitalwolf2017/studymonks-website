import type { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_META } from "@/models/base";
import LiveWorkClient from "./LiveWork.client";

interface PageProps {
  params: Promise<{
    meetingId: string;
    workId: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { meetingId, workId } = await params;

  return {
    title: `Live Work - ${DEFAULT_META.title}`,
    description: DEFAULT_META.description,
    keywords: DEFAULT_META.keywords,
    // Fix: Construct the object explicitly instead of spreading properties that don't exist
    openGraph: {
      title: `Live Work ID: ${workId}`, // Dynamic Title
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

const LiveWorkPage = async ({ params }: PageProps) => {
  const { meetingId, workId } = await params;

  return (
    <>
      <LiveWorkClient meetingId={Number(meetingId)} workId={Number(workId)} />
    </>
  );
};

export default LiveWorkPage;
