export interface LiveWork {
  id: number;
  title: string;
  zoom_meeting_id: number;
  type: number; // e.g. 1 for class work and 2 for the home-work
  pdf: string | null;
  video_url?: string | null;
  description?: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user_answers: any[];
}

export interface LiveClassBatch {
  id: number;
  class_room_id: number;
  subject_id: number;
  title: string;
  description: string | null;
  image_url: string;
  start_date: string;
  end_date: string;
  active: number;
  order: number;
  is_paid: number;
  access_username?: string | null;
  access_password?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ClassRoom {
  id: number;
  board_id: number;
  title: string;
  image_url: string | null;
  total_subjects: number;
  total_chapters: number;
  total_tutorials: number;
  total_notes: number;
  total_duration: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface LiveClassSubject {
  id: number;
  class_room_id: number;
  title: string;
  image_url: string;
  total_chapters: number;
  total_tutorials: number;
  total_notes: number;
  total_duration: number;
  active: number;
  created_at: string;
  updated_at: string;
  is_paid: number;
  live_classes_count?: number; // Optional based on list response
  batches: LiveClassBatch[];
  class_room: ClassRoom;
}

// Interface for an individual item in the schedule list & meeting details
export interface LiveClassScheduleItem {
  id: number;
  class_room_id: number;
  subject_id: number;
  batch_id: number;
  topic: string;
  agenda: string;
  image_url: string | null;
  start_time: string; // "YYYY-MM-DD HH:mm:ss"
  duration: number;
  zoom_meeting_id: string;
  zoom_meeting_uuid: string;
  zoom_meeting_host_id: string;
  zoom_meeting_host_email: string;
  type: number;
  status: number; // 0: Upcoming, 1: Live, 2: Completed
  summary: string | null;
  join_url?: string;
  start_url?: string;
  password?: string;
  vod_output?: string; // For recording
  created_at: string;
  updated_at: string;

  // Relationships
  subject: {
    id: number;
    class_room_id: number;
    title: string;
    image_url: string;
    total_chapters: number;
    total_tutorials: number;
    total_notes: number;
    total_duration: number;
    active: number;
    created_at: string;
    updated_at: string;
  };
  batch: LiveClassBatch;
  class_room?: ClassRoom; // Present in detailed view

  // Live Works (Classwork/Homework)
  live_works: LiveWork[];
}

// Interface for Meeting Details API Response (GET)
export interface MeetingDetailsResponse {
  success: boolean;
  data: LiveClassScheduleItem;
  message?: string;
  error?: string;
}

// Interface for Dashboard API Response (POST)
export interface LiveClassesResponseData {
  live_classes_schedule: LiveClassScheduleItem[];
  live_classes_subjects: LiveClassSubject[];
}

export interface LiveClassesApiResponse {
  success: boolean;
  data: LiveClassesResponseData;
  message?: string;
  error?: string;
}

// section for the recorded section pagination data tables
// src/models/liveClasses.ts

export interface BatchDetails {
  id: number;
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
  // Add other fields from your JSON if needed
}

export interface MeetingData {
  id: number;
  topic: string;
  start_time: string;
  status: number; // 0: Upcoming, 1: Live, 2: Completed
  join_url?: string;
  vod_output?: string;
  subject?: {
    title: string;
  };
}

export interface LiveMeetingPaginatedResponse {
  current_page: number;
  data: MeetingData[]; // The array of meetings
  last_page: number;
  total: number;
  per_page: number;
}

export interface BatchAPIResponse {
  success: boolean;
  data: {
    batch_details: BatchDetails;
    live_meeting_details: LiveMeetingPaginatedResponse;
  };
}
