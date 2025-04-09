// src/components/sections/Hero.tsx
import React from 'react';
import styles from './Hero.module.css';
import { useInView } from 'react-intersection-observer';
import CountdownTimer from '../ui/CountdownTimer';

const Hero: React.FC = () => {
    // Animation Refs
    const { ref: contentRef, inView: contentInView } = useInView({ triggerOnce: true, threshold: 0.1 });

    // Handle smooth scroll
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className={styles.hero} id="hero">
            <div className={`container ${styles.heroContainer}`}>
                {/* Hero Content */}
                <div
                    ref={contentRef}
                    className={`${styles.heroContent} ${contentInView ? 'animate fade-up' : 'animate'}`}
                >
                    {/* Container for top badges */}
                    <div className={styles.topBadgesContainer}>
                        {/* Alert Kept */}
                        <p className={styles.startDateAlert}>Starts April 9th, 2025</p>
                        {/* Eyebrow Kept */}
                        <span className={styles.eyebrow}>8+ Month Immersive Program</span>
                    </div>

                    <h1>2025 Progressive Mediumship Course</h1>
                    <p className={styles.heroSubtitle}>
                        "As a medium, you are not allowed to give away your power — you are in charge of the sitting."
                    </p>

                    {/* Add the CountdownTimer component */}
                    <CountdownTimer 
                        targetDate={new Date("Apr 9, 2025 18:00:00")} 
                        totalStudents={14} 
                        spotsRemaining={1} 
                    />

                    <div className={styles.heroButtonGroup}>
                        <a 
                            href="#pricing" 
                            className={`btn btn-primary ${styles.heroCta}`}
                            onClick={(e) => handleSmoothScroll(e, 'pricing')}
                        >
                            Secure Your Place Now
                        </a>
                        <a 
                            href="#about" 
                            className={`btn btn-light ${styles.heroSecondary}`}
                            onClick={(e) => handleSmoothScroll(e, 'about')}
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;