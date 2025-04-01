// src/utils/meta-event.ts
import { CustomData, EventOptions } from './meta-event-types';

const metaEvents = {
  /**
   * Send an event to Meta via the Conversions API
   */
  sendEvent: async (
    eventName: string, 
    customData: CustomData = { value: 0, currency: 'EUR' }, 
    options: EventOptions = {}
  ) => {
    try {
      // Get Facebook cookies if available
      const getFbp = (): string | null => {
        if (typeof document === 'undefined') return null;
        const cookies = document.cookie.split(';');
        const fbpCookie = cookies.find(c => c.trim().startsWith('_fbp='));
        return fbpCookie ? fbpCookie.split('=')[1] : null;
      };
      
      const getFbc = (): string | null => {
        if (typeof document === 'undefined') return null;
        const cookies = document.cookie.split(';');
        const fbcCookie = cookies.find(c => c.trim().startsWith('_fbc='));
        return fbcCookie ? fbcCookie.split('=')[1] : null;
      };

      // Format user data
      const userData = {
        client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        fbp: getFbp(),
        fbc: getFbc()
      };

      // Prepare event data in the format Meta Conversions API expects
      const payload = {
        data: [{
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: options.eventId || `${eventName}_${Date.now()}`,
          event_source_url: options.url || (typeof window !== 'undefined' ? window.location.href : ''),
          action_source: 'server', // Mark as server event
          user_data: userData,
          custom_data: customData
        }],
        test_event_code: 'TEST49303' // Add test event code
      };

      // Log the event for debugging
      console.log(`📊 Sending ${eventName} event to Meta CAPI`, payload);

      // Send to your API endpoint
      const response = await fetch('/api/meta-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Error sending Meta event:', result);
        return { success: false, ...result };
      }
      
      console.log(`✅ ${eventName} event sent successfully`);
      return { success: true, ...result };
    } catch (error) {
      console.error('Error sending Meta event:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  // Convenience methods with explicit typing
  pageView: (customData: CustomData = { value: 0, currency: 'EUR' }, options: EventOptions = {}) => {
    return metaEvents.sendEvent('PageView', customData, options);
  },
  
  viewContent: (customData: CustomData = { value: 0, currency: 'EUR' }, options: EventOptions = {}) => {
    return metaEvents.sendEvent('ViewContent', customData, options);
  },
  
  addToCart: (customData: CustomData = { value: 0, currency: 'EUR' }, options: EventOptions = {}) => {
    return metaEvents.sendEvent('AddToCart', customData, options);
  },
  
  initiateCheckout: (customData: CustomData = { value: 0, currency: 'EUR' }, options: EventOptions = {}) => {
    return metaEvents.sendEvent('InitiateCheckout', customData, options);
  },
  
  purchase: (customData: CustomData = { value: 0, currency: 'EUR' }, options: EventOptions = {}) => {
    return metaEvents.sendEvent('Purchase', customData, options);
  }
};

export default metaEvents;