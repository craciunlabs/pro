// src/utils/meta-event.ts

export interface UserData {
    fbp?: string | null;
    fbc?: string | null;
  }
  
  export interface CustomData {
    value: number;
    currency: string;
    [key: string]: any;
  }
  
  export interface EventOptions {
    url?: string;
    eventId?: string;
  }
  
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
  
        // Prepare event data
        const eventData = {
          eventName,
          eventTime: Math.floor(Date.now() / 1000),
          eventSourceUrl: options.url || (typeof window !== 'undefined' ? window.location.href : ''),
          userData: {
            fbp: getFbp(),
            fbc: getFbc()
          },
          customData: {
            value: customData.value || 0,
            currency: customData.currency || 'EUR',
            ...customData
          },
          eventId: options.eventId || `${eventName}_${Date.now()}`
        };
  
        // Log the event for debugging
        console.log(`📊 Sending ${eventName} event to Meta CAPI`, eventData);
  
        // Send to your API endpoint
        const response = await fetch('/api/meta-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventData)
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
  
    // Convenience methods for common events
    pageView: (customData = { value: 0, currency: 'EUR' }, options = {}) => {
      return metaEvents.sendEvent('PageView', customData, options);
    },
    
    viewContent: (customData = { value: 0, currency: 'EUR' }, options = {}) => {
      return metaEvents.sendEvent('ViewContent', customData, options);
    },
    
    addToCart: (customData = { value: 0, currency: 'EUR' }, options = {}) => {
      return metaEvents.sendEvent('AddToCart', customData, options);
    },
    
    initiateCheckout: (customData = { value: 0, currency: 'EUR' }, options = {}) => {
      return metaEvents.sendEvent('InitiateCheckout', customData, options);
    },
    
    purchase: (customData = { value: 0, currency: 'EUR' }, options = {}) => {
      return metaEvents.sendEvent('Purchase', customData, options);
    }
  };
  
  export default metaEvents;