export interface Device {
  identifier: string;
  device_name: string;
  user_id: number;
  type: number;
  platform: number;
  last_watched?: {
    _seconds: number;
    _nanoseconds: number;
  };
  force_logout: boolean;
  timestamp?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

// API response interface
export interface ListDevicesApiResponse {
  devices: Device[];
}
export interface ActiveDevices {
  count: number;
}
export interface MaxDevices {
  success: boolean;
  max_devices: number;
}
export interface MySpace {
  success: boolean;
  max_devices: number;
  country: string;
  active_plan: string;
}

export interface Country {
  success: boolean;
  data: string;
  code: string;
  flag_png: string;
  flag_svg: string;
}
export interface TVLogin {
  code: string;
}
export interface MaxDevicesResponse {
  success: boolean;
  data: {
    max_devices: number;
  };
}
