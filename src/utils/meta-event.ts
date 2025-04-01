// src/utils/meta-event.ts
import { CustomData, EventOptions, EventName } from './meta-event-types';

// Re-export types correctly for isolatedModules
export type { CustomData, EventOptions, EventName };

// Meta Pixel ID - uses the one set in your HTML
const FB_PIXEL_ID = '529577443168923'; 
export { FB_PIXEL_ID };

// Event cache to prevent duplicates
const eventCache = new Set();

// Meta Pixel events utility
export const metaEvents = {
  /**
   * Initialize Meta Pixel
   */
  init: () => {
    if (typeof window !== 'undefined' && !window.fbq) {
      // Standard initialization code
      // This is usually handled by the script in index.html
    }
  },

  /**
   * Send event to Meta Pixel
   */
  sendEvent: async (
    eventName: EventName | string, 
    customData: CustomData = {}, 
    options: EventOptions = {}
  ) => {
    try {
      // Create a unique key for this event to prevent duplicates
      const eventKey = `${eventName}_${JSON.stringify(customData)}_${Date.now().toString().substring(0, 8)}`;
      
      // Check if we've already sent this event in the last 10 seconds
      if (eventCache.has(eventKey)) {
        return { success: false, duplicate: true };
      }
      
      // Add to cache with 10-second expiration
      eventCache.add(eventKey);
      setTimeout(() => {
        eventCache.delete(eventKey);
      }, 10000);

      // Prepare user data from options
      const userData: Record<string, any> = {
        external_id: options.userData?.externalId || 'anonymous',
        client_user_agent: navigator.userAgent,
      };
      
      // Add optional user data if present
      if (options.userData?.clientIpAddress) userData.client_ip_address = options.userData.clientIpAddress;
      if (options.userData?.email) userData.em = options.userData.email;
      if (options.userData?.phone) userData.ph = options.userData.phone;
      if (options.userData?.firstName) userData.fn = options.userData.firstName;
      if (options.userData?.lastName) userData.ln = options.userData.lastName;

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
            event_source_url: options.eventSourceUrl || window.location.href,
            action_source: 'website',
            user_data: userData,
            custom_data: customData,
            event_id: options.eventID || `client_${eventName}_${Date.now()}`
          }]
        })
      });

      const data = await response.json();
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  // Helper methods for common events
  pageView: (options: EventOptions = {}) => {
    return metaEvents.sendEvent('PageView', {}, options);
  },
  
  initiateCheckout: (valueOrData: number | CustomData, currencyOrOptions?: string | EventOptions, optionsParam?: EventOptions) => {
    // Normalize parameters to handle different call signatures
    let customData: CustomData;
    let options: EventOptions = {};
    
    if (typeof valueOrData === 'number') {
      const currency = typeof currencyOrOptions === 'string' ? currencyOrOptions : 'EUR';
      customData = { value: valueOrData, currency };
      options = optionsParam || {};
    } else {
      customData = valueOrData;
      options = (typeof currencyOrOptions === 'object' ? currencyOrOptions : {}) as EventOptions;
    }
    
    return metaEvents.sendEvent('InitiateCheckout', customData, options);
  },
  
  purchase: (valueOrData: number | CustomData, currencyOrOptions?: string | EventOptions, optionsParam?: EventOptions) => {
    // Normalize parameters to handle different call signatures
    let customData: CustomData;
    let options: EventOptions = {};
    
    if (typeof valueOrData === 'number') {
      const currency = typeof currencyOrOptions === 'string' ? currencyOrOptions : 'EUR';
      customData = { value: valueOrData, currency };
      options = optionsParam || {};
    } else {
      customData = valueOrData;
      options = (typeof currencyOrOptions === 'object' ? currencyOrOptions : {}) as EventOptions;
    }
    
    return metaEvents.sendEvent('Purchase', customData, options);
  },
};

export default metaEvents;