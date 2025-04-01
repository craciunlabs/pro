// src/utils/meta-event-types.ts

// Common Meta Pixel event names
export type EventName = 
  | 'PageView'
  | 'AddPaymentInfo'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'CompleteRegistration'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'InitiateCheckout'
  | 'Lead'
  | 'Purchase'
  | 'Schedule'
  | 'Search'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe'
  | 'ViewContent';

// Custom event data parameters
export interface CustomData {
  [key: string]: any;
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  order_id?: string;
  transaction_id?: string;
  predicted_ltv?: number;
  num_items?: number;
  search_string?: string;
  status?: string;
}

// User data for better matching
export interface UserData {
  externalId?: string;
  clientIpAddress?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  birthdate?: string;
  fbc?: string; // Facebook Click ID
  fbp?: string; // Facebook Browser ID
}

// Options for event tracking
export interface EventOptions {
  eventID?: string;
  eventSourceUrl?: string;
  userData?: UserData;
}