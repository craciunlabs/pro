// src/components/sections/Hero.tsx
import React from 'react';
import styles from './Hero.module.css';
import { useInView } from 'react-intersection-observer';

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
                        {/* Alert Updated */}
                        <p className={styles.startDateAlert}>2026 Dates to be Announced</p>
                        {/* Eyebrow Kept */}
                        <span className={styles.eyebrow}>8+ Month Immersive Program</span>
                    </div>

                    <h1 className={styles.heroTitle}>Progressive Mediumship</h1>
                    <h2 className={styles.heroSubtitle}>A Transformative 8+ Month Journey</h2>
                    <div className={styles.heroDescription}>
                        <p>Join a select group of dedicated students in this intensive program designed to elevate and nurture your own authentic mediumship.</p>
                        <p className={styles.heroSubNote}>*free of fluff or molding</p>
                    </div>

                    <div className={styles.heroButtonGroup}>
                        <a
                            href="/waiting-list"
                            className={`btn btn-primary ${styles.heroCta}`}
                        >
                            Join Waiting List for 2026
                        </a>
                        <a
                            href="#about"
                            className={`btn btn-light ${styles.heroSecondary}`}
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleSmoothScroll(e, 'about')}
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