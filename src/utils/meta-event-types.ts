// src/utils/meta-event-types.ts

export interface CustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: Array<{
      id?: string;
      quantity?: number;
      item_price?: number;
  }>;
  content_type?: string;
  order_id?: string;
  predicted_ltv?: number;
  num_items?: number;
  search_string?: string;
  status?: string;
  [key: string]: any;
}

export interface EventOptions {
  debug?: boolean;
  eventID?: string;
  eventSourceUrl?: string;
  userData?: {
      email?: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      gender?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
      externalId?: string;
      clientIpAddress?: string;
      clientUserAgent?: string;
      fbc?: string;
      fbp?: string;
      subscriptionId?: string;
      fbLoginId?: string;
      leadId?: string;
      [key: string]: string | undefined;
  };
}

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