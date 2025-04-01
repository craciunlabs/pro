// src/utils/meta-event.ts
import { CustomData, EventOptions } from './meta-event-types';

const metaEvents = {
  sendEvent: async (
    eventName: string, 
    customData: CustomData = { value: 0, currency: 'EUR' }, 
    options: EventOptions = {}
  ) => {
    try {
      // Using options parameter to avoid TypeScript warning
      const debug = options.debug || false;
      
      // Simplified payload with server-specific parameters clearly set
      const payload = {
        data: [{
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: `server_${eventName}_${Date.now()}`, // Prefix with "server_" to distinguish
          event_source_url: typeof window !== 'undefined' ? window.location.href : '',
          action_source: "website", // Changed from "server" to "website" to match Meta's requirements
          user_data: {
            client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            // Add a test external_id for user identification as required by Meta
            external_id: "test_user_123"
          },
          custom_data: customData
        }],
        test_event_code: "TEST49303" // Make sure this matches exactly what you see in Meta dashboard
      };

      if (debug) console.log(`📊 Sending server-side ${eventName} event to Meta`, payload);

      const response = await fetch('/api/meta-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Error sending Meta event:', result);
        return { success: false, ...result };
      }
      
      if (debug) console.log(`✅ Server-side ${eventName} event sent successfully`);
      return { success: true, ...result };
    } catch (error) {
      console.error('Error sending Meta event:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Keep your convenience methods as they are
  pageView: (customData: CustomData = { value: 0, currency: 'EUR' }, options: EventOptions = {}) => {
    return metaEvents.sendEvent('PageView', customData, options);
  },
  
  purchase: (customData: CustomData = { value: 0, currency: 'EUR' }, options: EventOptions = {}) => {
    return metaEvents.sendEvent('Purchase', customData, options);
  },

  // Add the missing initiateCheckout method
  initiateCheckout: (customData: CustomData = { value: 0, currency: 'EUR' }, options: EventOptions = {}) => {
    return metaEvents.sendEvent('InitiateCheckout', customData, options);
  }
};

export default metaEvents;