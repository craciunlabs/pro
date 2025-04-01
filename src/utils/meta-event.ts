// src/utils/meta-event.ts

// Meta Pixel ID - uses the one set in your HTML
const FB_PIXEL_ID = '529577443168923';

// Types for events
export interface CustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: Array<{id: string, quantity: number}>;
  content_type?: string;
  num_items?: number;
  status?: string;
  [key: string]: any;
}

export interface EventOptions {
  eventID?: string;
  [key: string]: any;
}

interface UserData {
  external_id?: string;
  client_user_agent?: string;
  client_ip_address?: string;
  em?: string; // hashed email
  ph?: string; // hashed phone
  fn?: string; // hashed first name
  ln?: string; // hashed last name
  [key: string]: any;
}

// Event cache to prevent duplicates
const eventCache = new Set();

// Meta Pixel events utility
export const metaEvents = {
  /**
   * Initialize Meta Pixel
   */
  init: () => {
    if (typeof window !== 'undefined' && !window.fbq) {
      console.log('Initializing Meta Pixel');
      // Standard initialization code
      // This is usually handled by the script in index.html
    }
  },

  /**
   * Send event to Meta Pixel
   */
  sendEvent: async (
    eventName: string, 
    customData: CustomData = {}, 
    options: EventOptions = {}
  ) => {
    try {
      // Create a unique key for this event to prevent duplicates
      const eventKey = `${eventName}_${JSON.stringify(customData)}_${Date.now().toString().substring(0, 8)}`;
      
      // Check if we've already sent this event in the last 10 seconds
      if (eventCache.has(eventKey)) {
        console.log(`🔄 Duplicate event prevented: ${eventName}`);
        return { success: false, duplicate: true };
      }
      
      // Add to cache with 10-second expiration
      eventCache.add(eventKey);
      setTimeout(() => {
        eventCache.delete(eventKey);
      }, 10000);

      // Client-side uses browser's user agent
      const userData: UserData = {
        external_id: options.external_id || 'anonymous',
        client_user_agent: navigator.userAgent
      };

      // Track on client side too for redundancy
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, customData, { eventID: options.eventID });
      }

      // Send to server endpoint
      const response = await fetch('/api/meta-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: window.location.href,
            action_source: 'website',
            user_data: userData,
            custom_data: customData,
            event_id: options.eventID || `client_${eventName}_${Date.now()}`
          }],
          test_event_code: 'TEST49303' // Remove this in production
        })
      });

      const data = await response.json();
      console.log(`Event sent: ${eventName}`, data);
      return { success: true, data };
    } catch (error) {
      console.error(`Failed to send event: ${eventName}`, error);
      return { success: false, error };
    }
  },

  // Helper methods for common events
  pageView: (options = {}) => metaEvents.sendEvent('PageView', {}, options),
  
  purchase: (value: number, currency = 'EUR', options = {}) => 
    metaEvents.sendEvent('Purchase', { value, currency }, options),
  
  initiateCheckout: (value: number, currency = 'EUR', options = {}) => 
    metaEvents.sendEvent('InitiateCheckout', { value, currency }, options),
};

export default metaEvents;