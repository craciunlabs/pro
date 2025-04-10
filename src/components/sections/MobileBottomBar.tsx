// src/components/sections/MobileBottomBar.tsx
import React from 'react';
import styles from './MobileBottomBar.module.css';

const MobileBottomBar: React.FC = () => {
    // Function to handle button click - could add tracking here if needed
    const handleClick = () => {
        if (window.fbq) {
             console.log('Pixel: Firing MobileBottomBar CTA Click (Optional Event)');
             // Example custom event
             // window.fbq('trackCustom', 'MobileCTAClick');
        }
    };

    return (
        <div className={styles.mobileBottomBar}>
             {/* Use global button classes */}
             {/* Link to waiting list page as primary mobile CTA */}
            <a
                href="/waiting-list"
                className={`btn btn-primary btn-block ${styles.mobileCtaButton}`}
                onClick={handleClick} // Add optional tracking
            >
                Join Waiting List
            </a>
        </div>
    );
};

export default MobileBottomBar;