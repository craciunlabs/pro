// src/utils/meta-event.d.ts
declare module '../utils/meta-event' {
  interface CustomData {
    value: number;
    currency: string;
    [key: string]: any;
  }

  interface EventOptions {
    url?: string;
    eventId?: string;
  }

  const metaEvents: {
    sendEvent: (eventName: string, customData?: CustomData, options?: EventOptions) => Promise<any>;
    pageView: (customData?: CustomData, options?: EventOptions) => Promise<any>;
    viewContent: (customData?: CustomData, options?: EventOptions) => Promise<any>;
    addToCart: (customData?: CustomData, options?: EventOptions) => Promise<any>;
    initiateCheckout: (customData?: CustomData, options?: EventOptions) => Promise<any>;
    purchase: (customData?: CustomData, options?: EventOptions) => Promise<any>;
  };

  export default metaEvents;
}

declare module '../../utils/meta-event' {
  interface CustomData {
    value: number;
    currency: string;
    [key: string]: any;
  }

  interface EventOptions {
    url?: string;
    eventId?: string;
  }

  const metaEvents: {
    sendEvent: (eventName: string, customData?: CustomData, options?: EventOptions) => Promise<any>;
    pageView: (customData?: CustomData, options?: EventOptions) => Promise<any>;
    viewContent: (customData?: CustomData, options?: EventOptions) => Promise<any>;
    addToCart: (customData?: CustomData, options?: EventOptions) => Promise<any>;
    initiateCheckout: (customData?: CustomData, options?: EventOptions) => Promise<any>;
    purchase: (customData?: CustomData, options?: EventOptions) => Promise<any>;
  };

  export default metaEvents;
}