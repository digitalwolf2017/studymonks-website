import LiveClient from "./live.client";

export default async function Live({ slug }: { slug: string }) {
    return (
        <>
            <LiveClient slug={slug} />
        </>
    );
}