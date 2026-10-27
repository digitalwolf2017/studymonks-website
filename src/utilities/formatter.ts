// Helper to format Date to "DD-MM-YYYY" for API
export const formatDateForApi = (date: Date) => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

// Helper to format display time (e.g., "28 Aug 2025 : 4:00 PM")
export const formatDisplayDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};
