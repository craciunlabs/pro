// src/utils/meta-event.ts
import { CustomData, EventOptions, EventName } from './meta-event-types';

// Re-export types correctly for isolatedModules
export type { CustomData, EventOptions, EventName };

// Meta Pixel ID - uses the one set in your HTML
const FB_PIXEL_ID = '529577443168923'; 
export { FB_PIXEL_ID };

// Event cache to prevent duplicates
const eventCache = new Set();

// Function to get fbclid from URL or storage
const getFbclid = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Try to get from URL first
  const urlParams = new URLSearchParams(window.location.search);
  const fbclidFromUrl = urlParams.get('fbclid');
  
  if (fbclidFromUrl) {
    // Store in localStorage for future use (expires in 7 days)
    try {
      localStorage.setItem('fbclid', fbclidFromUrl);
      localStorage.setItem('fbclid_timestamp', Date.now().toString());
    } catch (e) {
      // Handle potential localStorage errors
      console.warn('Unable to store fbclid in localStorage');
    }
    return fbclidFromUrl;
  }
  
  // Try to get from localStorage if not in URL
  try {
    const storedFbclid = localStorage.getItem('fbclid');
    const timestamp = localStorage.getItem('fbclid_timestamp');
    
    // Check if fbclid exists and is still valid (7 days)
    if (storedFbclid && timestamp) {
      const expiryTime = parseInt(timestamp) + (7 * 24 * 60 * 60 * 1000);
      if (Date.now() < expiryTime) {
        return storedFbclid;
      } else {
        // Clear expired fbclid
        localStorage.removeItem('fbclid');
        localStorage.removeItem('fbclid_timestamp');
      }
    }
  } catch (e) {
    // Handle potential localStorage errors
    console.warn('Unable to retrieve fbclid from localStorage');
  }
  
  return null;
};

// Function to get fbc (Click ID) in the proper format
const getFbc = (): string | null => {
  const fbclid = getFbclid();
  if (!fbclid) return null;
  
  // Format: fb.1.{timestamp}.{fbclid}
  const timestamp = Math.floor(Date.now() / 1000);
  return `fb.1.${timestamp}.${fbclid}`;
};

// Function to get fbp (Browser ID) from cookies
const getFbp = (): string | null => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  
  // Try to get _fbp cookie
  const cookies = document.cookie.split(';');
  const fbpCookie = cookies.find(cookie => cookie.trim().startsWith('_fbp='));
  
  if (fbpCookie) {
    return fbpCookie.trim().substring(5); // Remove '_fbp=' prefix
  }
  
  return null;
};

// Function to hash user data when needed
const hashData = (data: string): string => {
  // In a real implementation, you'd use a proper hashing function like SHA-256
  // For now, return the data as-is since we're noting "Not hashed - no hash required"
  return data;
};

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
      // Debounce for specific events
      const isHighFrequencyEvent = ['InitiateCheckout', 'PageView'].includes(eventName);
      const eventKey = `${eventName}_${JSON.stringify(customData)}_${Date.now().toString().substring(0, isHighFrequencyEvent ? 8 : 10)}`;
      
      // Check if we've already sent this event in the last period
      if (eventCache.has(eventKey)) {
        return { success: false, duplicate: true };
      }
      
      // Add to cache with expiration based on event type
      eventCache.add(eventKey);
      setTimeout(() => {
        eventCache.delete(eventKey);
      }, isHighFrequencyEvent ? 3000 : 10000);

      // Get identifiers for better tracking
      const fbc = getFbc(); // Click ID
      const fbp = getFbp(); // Browser ID

      // Prepare user data from options
      const userData: Record<string, any> = {
        client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      };
      
      // Add any user data provided in options
      if (options.userData) {
        Object.entries(options.userData).forEach(([key, value]) => {
          if (value) userData[key] = value;
        });
      }
      
      // Add Click ID and Browser ID if available
      if (fbc) userData.fbc = fbc;
      if (fbp) userData.fbp = fbp;
      
      // Add IP address if available (typically on server side)
      if (options.userData?.clientIpAddress) userData.client_ip_address = options.userData.clientIpAddress;
      
      // Add customer information parameters (if provided)
      if (options.userData?.email) userData.em = hashData(options.userData.email);
      if (options.userData?.phone) userData.ph = hashData(options.userData.phone);
      if (options.userData?.firstName) userData.fn = hashData(options.userData.firstName);
      if (options.userData?.lastName) userData.ln = hashData(options.userData.lastName);
      
      // Add optional location parameters (if provided)
      if (options.userData?.city) userData.ct = hashData(options.userData.city);
      if (options.userData?.state) userData.st = hashData(options.userData.state);
      if (options.userData?.zip) userData.zp = hashData(options.userData.zip);
      if (options.userData?.country) userData.country = hashData(options.userData.country);

      // Generate event ID if not provided
      const eventID = options.eventID || `client_${eventName}_${Date.now()}`;

      // Track on client side for redundancy
      if (typeof window !== 'undefined' && window.fbq) {
        // Prepare client-side event options
        const fbqOptions: Record<string, any> = { eventID };
        
        // Include fbc in client-side event if available
        if (fbc) {
          fbqOptions.fbc = fbc;
        }
        
        console.log(`Firing client-side ${eventName} event with options:`, fbqOptions);
        window.fbq('track', eventName, customData, fbqOptions);
      }

      // Prepare server-side event data
      const eventData = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: options.eventSourceUrl || (typeof window !== 'undefined' ? window.location.href : ''),
        action_source: 'website',
        user_data: userData,
        custom_data: customData,
        event_id: eventID
      };
      
      console.log(`Sending server-side ${eventName} event with data:`, {
        ...eventData,
        user_data: {
          ...eventData.user_data,
          // Mask any sensitive data in logs
          em: eventData.user_data.em ? '[MASKED]' : undefined,
          ph: eventData.user_data.ph ? '[MASKED]' : undefined
        }
      });

      // Send to server endpoint
      const response = await fetch('/api/meta-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [eventData]
        })
      });

      const data = await response.json();
      
      return { success: true, data };
    } catch (error) {
      console.error('Error sending Meta event:', error);
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
  
  // Add the addToCart method
  addToCart: (valueOrData: number | CustomData, currencyOrOptions?: string | EventOptions, optionsParam?: EventOptions) => {
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
    
    return metaEvents.sendEvent('AddToCart', customData, options);
  },
  
  // Add the lead method
  lead: (valueOrData: number | CustomData, currencyOrOptions?: string | EventOptions, optionsParam?: EventOptions) => {
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
    
    return metaEvents.sendEvent('Lead', customData, options);
  },
  
  // Add the completeRegistration method
  completeRegistration: (valueOrData: number | CustomData, currencyOrOptions?: string | EventOptions, optionsParam?: EventOptions) => {
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
    
    return metaEvents.sendEvent('CompleteRegistration', customData, options);
  },
};

export default metaEvents;