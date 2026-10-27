import React from "react";
import RecordedDashboardClient from "./recordedDashboard.client";

interface ServerProps {
  slug: string;
}

// ✅ FIX: Accept props and pass them to the client
const RecordedDashboardServer = async ({ slug }: ServerProps) => {
  return (
    <>
      {/* Convert string slug to number for the API */}
      <RecordedDashboardClient batchId={Number(slug)} />
    </>
  );
};

export default RecordedDashboardServer;
