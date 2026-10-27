import RecordedClassessClient from "./recordedClassess.client";

interface ServerProps {
  slug: string;
}

export default async function RecordedClassess({ slug }: ServerProps) {
  return (
    <>
      <RecordedClassessClient meetingId={slug} />
    </>
  );
}
