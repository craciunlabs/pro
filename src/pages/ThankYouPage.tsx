// src/pages/ThankYouPage.tsx
import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt, faClock, faUsers, faGift, faVideo, faCalendarCheck, faPlayCircle, faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import styles from './ThankYouPage.module.css'; // Ensure this CSS module exists
import metaEvents from '../utils/meta-event';
import { CustomData } from '../utils/meta-event-types';

// Declare fbq for TypeScript
declare global { interface Window { fbq?: (...args: any[]) => void; } }

// Function to get URL parameters
const getUrlParameter = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(name);
};

// Function to get fbclid from URL or localStorage
const getFbclid = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Try to get from URL first
  const fbclidFromUrl = getUrlParameter('fbclid');
  
  if (fbclidFromUrl) {
    // Store in localStorage for future use
    try {
      localStorage.setItem('fbclid', fbclidFromUrl);
      localStorage.setItem('fbclid_timestamp', Date.now().toString());
    } catch (e) {
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
      }
    }
  } catch (e) {
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

const ThankYouPage: React.FC = () => {
    const confirmationBoxRef = useRef<HTMLDivElement>(null);

    // --- Meta Pixel & CAPI Tracking ---
    useEffect(() => {
        // Get Facebook Click ID and Browser ID
        const fbc = getFbc();
        const fbp = getFbp();
        
        // Prepare user data for better tracking
        const userData: Record<string, any> = {};
        if (fbc) userData.fbc = fbc;
        if (fbp) userData.fbp = fbp;
        
        // Event ID to prevent duplicates
        const eventID = `purchase_${Date.now()}`;

        // Get any Calendly parameters if they were passed
        const eventUuid = getUrlParameter('event_uuid');

        // --- 1. Client-Side Pixel Event with improved parameters ---
        if (window.fbq) {
            console.log('Firing Meta Pixel Purchase Event (Client-Side)');
            const purchaseData = { 
                value: 1295, 
                currency: 'EUR',
                content_ids: ['progressive-mediumship-course'],
                content_name: 'Progressive Mediumship Course'
            };
            
            // Include fbc in client-side event if available
            const eventOptions = { eventID };
            if (fbc) {
                console.log('Including fbc in client-side event:', fbc);
                // @ts-ignore - fbq accepts fbc but TypeScript might not know
                eventOptions.fbc = fbc;
            }
            
            window.fbq('track', 'Purchase', purchaseData, eventOptions);
        }
        
        // --- 2. Server-Side CAPI Trigger using metaEvents utility ---
        const customData: CustomData = {
            value: 1295,
            currency: 'EUR',
            content_ids: ['progressive-mediumship-course'],
            content_name: 'Progressive Mediumship Course'
        };
        
        // Add transaction ID if available from Calendly
        if (eventUuid) {
            customData.transaction_id = eventUuid;
        }
        
        console.log('Sending server-side purchase event with userData:', userData);
        
        metaEvents.purchase(customData, {
            eventID,
            userData: userData as any // Cast to expected type
        });
        
        // Store that this conversion has been tracked to prevent duplicates
        try {
            sessionStorage.setItem('purchase_tracked', 'true');
        } catch (e) {
            console.warn('Unable to store in sessionStorage');
        }
    }, []); // Only run once on component mount

    // --- Confetti Effect ---
    useEffect(() => {
        const isMobile = () => window.innerWidth <= 768;
        const colors = ['#845AFA', '#9D7AFF', '#FAAC5A', '#6C2996', '#FF6B6B'];
        const confettiCount = isMobile() ? 40 : 80;
        const container = confirmationBoxRef.current;
        let confettiElements: HTMLDivElement[] = [];
        if (container) {
            for (let i = 0; i < confettiCount; i++) {
                const confetti = document.createElement('div');
                confetti.className = styles.confetti;
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = (Math.random() * -20) + '%'; // Start above
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                const duration = Math.random() * 3 + 3; const delay = Math.random() * 4;
                confetti.style.animation = `${styles.confettiAnimation} ${duration}s ${delay}s ease-out forwards`;
                container.appendChild(confetti);
                confettiElements.push(confetti);
            }
        }
        return () => { confettiElements.forEach(el => el.remove()); }; // Cleanup
    }, []);

    // --- VH Fix for Mobile ---
    useEffect(() => {
        const setVH = () => {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        setVH(); window.addEventListener('resize', setVH);
        return () => window.removeEventListener('resize', setVH);
    }, []);

    // --- The rest of your component remains the same ---
    return (
        <div className={styles.container}>
            {/* Header - Profile Image Removed */}
            <div className={styles.header}>
                <h1 className={styles.title}>Thank You for Joining Us!</h1>
                <p className={styles.subtitle}>Your journey with the 2025 Progressive Mediumship Course begins now</p>
            </div>

            {/* Confirmation Box */}
            <div className={styles.confirmationBox} ref={confirmationBoxRef}>
                <h2>Your Spot is Confirmed! 🎉</h2>
                <p>We're excited to have you join Mia Ottosson's Progressive Mediumship Course for 2025</p>
                {/* Confetti injected via useEffect */}
            </div>

            {/* Course Details Boxes */}
            <div className={styles.courseDetails}>
                <div className={styles.detailBox}>
                    <div className={styles.icon}><FontAwesomeIcon icon={faCalendarAlt} /></div>
                    <h3>Start Date</h3>
                    <p>April 9th, 2025<br />6 PM (Sweden Time)</p>
                </div>
                <div className={styles.detailBox}>
                    <div className={styles.icon}><FontAwesomeIcon icon={faClock} /></div>
                    <h3>Duration</h3>
                    <p>8+ Months<br />40+ Hours of Development</p>
                </div>
                <div className={styles.detailBox}>
                    <div className={styles.icon}><FontAwesomeIcon icon={faUsers} /></div>
                    <h3>Community</h3>
                    <p>Join our supportive<br />Facebook group</p>
                </div>
            </div>

            {/* Next Steps Card */}
            <div className={styles.card}>
                <h2>Next Steps</h2>
                <ul className={styles.instructionList}>
                    <li>
                        <div className={styles.icon}><FontAwesomeIcon icon={faGift} /></div>
                        <div><strong>Claim Your BONUS!</strong> - Watch the "Secrets to Mediumship" 1-hour Masterclass recording that comes with your enrollment</div>
                    </li>
                    <li>
                        <div className={styles.icon}><FontAwesomeIcon icon={faFacebookF} /></div>
                        <div><strong>Join Our Community</strong> - Connect with fellow students in our private Facebook group for support and practice</div>
                    </li>
                    <li>
                        <div className={styles.icon}><FontAwesomeIcon icon={faVideo} /></div>
                        <div><strong>Check Your Email</strong> - We've sent you the Zoom link for all upcoming sessions</div>
                    </li>
                    <li>
                        <div className={styles.icon}><FontAwesomeIcon icon={faCalendarCheck} /></div>
                        <div><strong>Mark Your Calendar</strong> - A reminder will be automatically sent 24 hours before we start</div>
                    </li>
                </ul>
                <div className={styles.actions}>
                    <a href="https://vimeo.com/1048248963/79e84ecb1a" target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.primaryButton}`}>
                        <FontAwesomeIcon icon={faPlayCircle} style={{ marginRight: '8px' }} /> Watch Bonus Masterclass
                    </a>
                    <a href="https://www.facebook.com/groups/2976544015978501" target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.secondary}`}>
                        <FontAwesomeIcon icon={faFacebookF} style={{ marginRight: '8px' }} /> Join Facebook Group
                    </a>
                </div>
            </div>

            {/* Important Info Box */}
            <div className={styles.importantInfo}>
                <h3>Important Course Information</h3>
                <p><strong>Course Start:</strong> 9th April 2025 - 6 PM Sweden time (<a href="https://dateful.com/time-zone-converter" target="_blank" rel="noopener noreferrer">check your timezone here</a>)</p>
                <p><strong>Prerequisites:</strong> This course is not suitable for absolute beginners. You need to be able to establish a link with the spirit world.</p>
                <p><strong>Refund Policy:</strong> Please note that Mia has a strict no-refund policy for this course. <a href="/#faq" target="_blank" rel="noopener noreferrer">Read more here</a></p>
            </div>

            {/* Quote Card - Quote Mark Removed via CSS */}
            <div className={styles.card}>
                <div className={styles.quote}>
                    "The spirit world is here for us. Not the opposite."
                </div>
            </div>

            <div className={styles.divider}></div>

            {/* Contact Card */}
            <div className={styles.card}>
                <h2>Have Questions?</h2>
                <p>If you have any queries or need assistance, please don't hesitate to reach out to Mia directly.</p>
                <div className={styles.actions}>
                    <a href="mailto:mia@miaottosson.se" className={`${styles.button} ${styles.primaryButton}`}>
                        <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} /> Contact Mia
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
                <p>© {new Date().getFullYear()} Progressive Mediumship Course with Mia Ottosson. All rights reserved.</p>
            </div>
        </div>
    );
};

export default ThankYouPage;