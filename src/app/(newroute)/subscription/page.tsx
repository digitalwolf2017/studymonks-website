import type { Metadata, ResolvingMetadata } from 'next';
import { DEFAULT_META } from '@/models/base';
import Subscription from './subscription.server';

interface StaticPageProps {
    params: Promise<Record<string, never>>;
}

export async function generateMetadata(
    { params }: StaticPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    await params;

    return {
        title: DEFAULT_META.title,
        description: DEFAULT_META.description,
        keywords: DEFAULT_META.keywords,
        openGraph: {
            title: DEFAULT_META.title,
            description: DEFAULT_META.description,
            images: [
                {
                    url: DEFAULT_META.ogImage,
                    width: 1200,
                    height: 676,
                },
            ],
            type: 'website',
            url: DEFAULT_META.url,
        },
        twitter: {
            card: 'summary_large_image',
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

export default Subscription;

