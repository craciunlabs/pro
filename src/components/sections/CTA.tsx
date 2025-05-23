// src/components/sections/CTA.tsx
import React from 'react';
import styles from './CTA.module.css';
import { useInView } from 'react-intersection-observer';

const CTA: React.FC = () => {
    const { ref: contentRef, inView: contentInView } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        // The rest of your component remains unchanged
        <section className={styles.ctaSection} id="cta">
             {/* Use global container */}
            <div className="container">
                {/* Use module style for content wrapper */}
                <div ref={contentRef} className={`${styles.ctaContent} ${contentInView ? 'animate fade-up' : 'animate'}`}>
                     {/* Limited spots badge - UPDATED TO SOLD OUT */}
                    <span className={`${styles.limitedSpots} pulse`}>Program SOLD OUT for 2025</span>

                     {/* Heading inherits global h2 style */}
                     {/* Use module style for quote emphasis */}
                    <h2>"The spirit world is here <span className={styles.quoteEmphasis}>for us</span>, not the opposite."</h2>

                    <p className={styles.ctaText}>Your decision to develop your gifts is a gift to both yourself and those you'll serve. This 8+ month journey will transform not just your mediumship skills but your relationship with your own intuitive abilities.</p>

                     {/* Use global button classes */}
                    <a 
                        href="/waiting-list" 
                        className={`btn btn-accent btn-large ${styles.ctaButton}`}
                    >
                        Join Waiting List for 2026
                    </a>

                    <p className={styles.ctaNote}>Registrations for 2026 opening soon</p>
                </div>
            </div>
            {/* Background pattern handled by ::before */}
        </section>
    );
};

export default CTA;