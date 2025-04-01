// src/utils/meta-event.ts (simplified version)
import { CustomData, EventOptions } from './meta-event-types';

const metaEvents = {
  sendEvent: async (
    eventName: string, 
    customData: CustomData = { value: 0, currency: 'EUR' }, 
    options: EventOptions = {}
  ) => {
    try {
      // Simplified payload with server-specific parameters clearly set
      const payload = {
        data: [{
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: `server_${eventName}_${Date.now()}`, // Prefix with "server_" to distinguish
          event_source_url: typeof window !== 'undefined' ? window.location.href : '',
          action_source: "server", // This must be exactly "server"
          user_data: {
            client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
          },
          custom_data: customData
        }],
        test_event_code: "TEST49303" // Make sure this matches exactly what you see in Meta dashboard
      };

      console.log(`📊 Sending server-side ${eventName} event to Meta`, payload);

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
      
      console.log(`✅ Server-side ${eventName} event sent successfully`);
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
  
  // ...other methods...
};

export default metaEvents;