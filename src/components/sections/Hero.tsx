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

                    <h1 className={styles.heroTitle}>Progressive Mediumship</h1>
                    <h2 className={styles.heroSubtitle}>A Transformative 8+ Month Journey</h2>
                    <div className={styles.heroDescription}>
                        <p>Join a select group of dedicated students in this intensive program designed to elevate your mediumship abilities to new heights.</p>
                        <div className={styles.heroStats}>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>8+</span>
                                <span className={styles.statLabel}>Months</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>40+</span>
                                <span className={styles.statLabel}>Hours</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>14</span>
                                <span className={styles.statLabel}>Students</span>
                            </div>
                        </div>
                        <div className={styles.heroCTA}>
                            <a href="https://calendly.com/miaottosson/waiting-list-2026" className="btn btn-primary btn-lg">Join Waiting List for 2026</a>
                            <p className={styles.heroNote}>Program is now SOLD OUT for 2025</p>
                        </div>
                    </div>

                    {/* Add the CountdownTimer component */}
                    <CountdownTimer 
                        targetDate={new Date("Apr 9, 2025 18:00:00")} 
                        totalStudents={14} 
                        spotsRemaining={0} 
                    />

                    <div className={styles.heroButtonGroup}>
                        <a 
                            href="#pricing" 
                            className={`btn btn-primary ${styles.heroCta}`}
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleSmoothScroll(e, 'pricing')}
                        >
                            Join Waiting List
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