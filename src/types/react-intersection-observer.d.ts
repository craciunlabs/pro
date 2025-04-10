declare module 'react-intersection-observer' {
  import { RefObject } from 'react';

  export interface UseInViewOptions {
    threshold?: number | number[];
    root?: Element | null;
    rootMargin?: string;
    triggerOnce?: boolean;
    delay?: number;
  }

  export interface UseInViewResponse {
    ref: (node?: Element | null) => void;
    inView: boolean;
    entry?: IntersectionObserverEntry;
  }

  export function useInView(options?: UseInViewOptions): UseInViewResponse;
} 