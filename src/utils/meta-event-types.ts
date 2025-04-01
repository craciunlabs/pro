// src/utils/meta-event-types.ts

export interface UserData {
    fbp?: string | null;
    fbc?: string | null;
  }
  
  export interface CustomData {
    value: number;
    currency: string;
    content_ids?: string[];
    content_name?: string;
    [key: string]: any; // This allows arbitrary properties
  }
  
  export interface EventOptions {
    url?: string;
    eventId?: string;
  }