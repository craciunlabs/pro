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
      console.log('Initializing Meta Pixel');
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
      // Debug logging
      console.log(`metaEvents.sendEvent: ${eventName}`, customData);
      
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
        console.log(`Calling client-side fbq('track', '${eventName}')`, customData);
        window.fbq('track', eventName, customData, { eventID: options.eventID });
      } else {
        console.warn('Client-side Meta Pixel not available (window.fbq is undefined)');
      }

      // Send to server endpoint
      console.log('Sending to server endpoint: /api/meta-event');
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
          }],
          test_event_code: 'TEST49303' // Remove this in production
        })
      });

      const data = await response.json();
      console.log(`Server response for ${eventName} event:`, data);
      
      return { success: true, data };
    } catch (error) {
      console.error(`Failed to send event: ${eventName}`, error);
      return { success: false, error };
    }
  },

  // Helper methods for common events
  pageView: (options: EventOptions = {}) => {
    console.log('metaEvents.pageView called');
    return metaEvents.sendEvent('PageView', {}, options);
  },
  
  initiateCheckout: (valueOrData: number | CustomData, currencyOrOptions?: string | EventOptions, optionsParam?: EventOptions) => {
    console.log('metaEvents.initiateCheckout called', valueOrData);
    
    // Normalize parameters to handle different call signatures
    let customData: CustomData;
    let options: