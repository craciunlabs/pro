// src/components/sections/CTA.tsx
import React from 'react';
import styles from './CTA.module.css';
import { useInView } from 'react-intersection-observer';
import metaEvents from '../../utils/meta-event'; // Import the metaEvents utility

const CTA: React.FC = () => {
    const { ref: contentRef, inView: contentInView } = useInView({ triggerOnce: true, threshold: 0.1 });

    // Add this function to handle the CTA click
    const handleCtaClick = () => {
        // Track InitiateCheckout event through Meta CAPI
        metaEvents.initiateCheckout({
            value: 1295, // The price of your course
            currency: 'EUR',
            content_ids: ['progressive-mediumship-course'],
            content_name: 'Progressive Mediumship Course',
            content_category: 'Course Registration'
        });
        
        // The actual navigation happens through the href attribute,
        // so no need to add navigation code here
    };

    return (
        // Use module style for section
        <section className={styles.ctaSection} id="cta">
             {/* Use global container */}
            <div className="container">
                {/* Use module style for content wrapper */}
                <div ref={contentRef} className={`${styles.ctaContent} ${contentInView ? 'animate fade-up' : 'animate'}`}>
                     {/* Limited spots badge */}
                    {/* Use global pulse animation */}
                    <span className={`${styles.limitedSpots} pulse`}>Only 5 spots remaining</span>

                     {/* Heading inherits global h2 style */}
                     {/* Use module style for quote emphasis */}
                    <h2>"The spirit world is here <span className={styles.quoteEmphasis}>for us</span>, not the opposite."</h2>

                    <p className={styles.ctaText}>Your decision to develop your gifts is a gift to both yourself and those you'll serve. This 8+ month journey will transform not just your mediumship skills but your relationship with your own intuitive abilities.</p>

                     {/* Use global button classes with added onClick handler */}
                    <a 
                        href="https://calendly.com/miaottosson/progressive-mediumship-2025/2025-04-09T18:00:00+02:00?month=2025-04&date=2025-04-09" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`btn btn-accent btn-large ${styles.ctaButton}`}
                        onClick={handleCtaClick} // Add the click handler here
                    >
                        Secure Your Place Today
                    </a>

                    <p className={styles.ctaNote}>Early registration ends April 8th, 2025</p>
                </div>
            </div>
            {/* Background pattern handled by ::before */}
        </section>
    );
};

export default CTA;