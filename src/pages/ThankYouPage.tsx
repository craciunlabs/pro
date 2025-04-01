// src/pages/ThankYouPage.tsx
import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt, faClock, faUsers, faGift, faVideo, faCalendarCheck, faPlayCircle, faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import styles from './ThankYouPage.module.css'; // Ensure this CSS module exists
import metaEvents from '../utils/metaEvents'; // Import the metaEvents utility

// Declare fbq for TypeScript
declare global { interface Window { fbq?: (...args: any[]) => void; } }

const ThankYouPage: React.FC = () => {
    const confirmationBoxRef = useRef<HTMLDivElement>(null);

    // --- Meta Pixel & CAPI Tracking ---
    useEffect(() => {
        // --- 1. Client-Side Pixel Event ---
        if (window.fbq) {
            console.log('Firing Meta Pixel Purchase Event (Client-Side)');
            const purchaseValue = 1295; // Example value
            const currency = 'EUR';
            window.fbq('track', 'Purchase', { value: purchaseValue, currency: currency });
        }

        // --- 2. Server-Side CAPI Trigger using metaEvents utility ---
        const purchaseValue = 1295;
        const currency = 'EUR';
        
        metaEvents.purchase({
            value: purchaseValue,
            currency: currency,
            content_ids: ['progressive-mediumship-course'],
            content_name: 'Progressive Mediumship Course'
        });
        
    }, []); // Run only once

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

    // --- Render Component ---
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

            {/* Rest of your component remains unchanged */}
            {/* ... */}
        </div>
    );
};

export default ThankYouPage;