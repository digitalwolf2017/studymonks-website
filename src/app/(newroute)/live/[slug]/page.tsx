import type { Metadata, ResolvingMetadata } from "next";
import { DEFAULT_META } from "@/models/base";
import Live from "./live.server";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return [
    { slug: "math" },
    { slug: "english" },
    { slug: "physics" },
    { slug: "chemistry" },
  ];
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const title = `${slug.toUpperCase()} | ${DEFAULT_META.title}`;

  return {
    title,
    description: `Live class page for ${slug}`,
    openGraph: {
      title,
      description: `Live class page for ${slug}`,
      images: [
        {
          url: DEFAULT_META.ogImage,
          width: 1200,
          height: 676,
        },
      ],
      type: "website",
      url: `${DEFAULT_META.url}/live/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `Live class page for ${slug}`,
      images: [DEFAULT_META.ogImage],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <Live slug={slug} />;
}
