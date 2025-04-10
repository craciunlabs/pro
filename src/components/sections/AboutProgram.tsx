// src/components/sections/AboutProgram.tsx
import React from 'react';
import styles from './AboutProgram.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useInView } from 'react-intersection-observer';

const AboutProgram: React.FC = () => {
    // Refs for animations
    const { ref: headingRef, inView: headingInView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: bannerRef, inView: bannerInView } = useInView({ triggerOnce: true, threshold: 0.1, delay: 100 });
    const { ref: statsGridRef, inView: statsGridInView } = useInView({ triggerOnce: true, threshold: 0.1, delay: 200 });
    const { ref: whyDifferentRef, inView: whyDifferentInView } = useInView({ triggerOnce: true, threshold: 0.1, delay: 300 });
    // Ref for the tags container to trigger animation when it's in view
    const { ref: tagsRef, inView: tagsInView } = useInView({ triggerOnce: true, threshold: 0.1 }); // Trigger when container is visible

    const statItems = [
        { number: '40+', label: 'Hours of Live Training' },
        { number: '8+', label: 'Months of Development' },
        { number: '14', label: 'Maximum Participants' },
        { number: '30+', label: 'Years of Experience' },
    ];

    const tagItems = [
        { label: 'Small Group Mentoring', delay: 0 },
        { label: 'Progressive Development', delay: 1 },
        { label: 'Balanced Approach', delay: 2 },
        { label: 'Authentic Teaching', delay: 3 },
        { label: 'Live Experimentation', delay: 1 } // Example: reuse delay
    ];


    return (
        // Use global section classes and ID
        <section className="section section-border" id="about">
            {/* Use global container */}
            <div className="container">
                {/* Use global section-heading and animation */}
                <div ref={headingRef} className={`section-heading ${headingInView ? 'animate fade-up' : 'animate'}`}>
                    <span className="section-subtitle">About the Program</span>
                    <h2>A Transformative Approach to Medium Development</h2>
                    <p>After 30+ years as a professional medium, I've designed this comprehensive program based on the understanding that medium development isn't a destination—it's a lifelong journey of growth, refinement, and deepening connection.</p>
                </div>

                {/* Use global banner class, module class for specificity, and animation */}
                <div ref={bannerRef} className={`banner ${styles.spotsBanner} ${bannerInView ? 'animate fade-up' : 'animate'}`}>
                     {/* Use global banner-icon class */}
                    <div className="banner-icon"><FontAwesomeIcon icon={faStar} /></div>
                    <div>Limited to just 14 participants - SOLD OUT for 2025!</div>
                </div>

                {/* Use global stats-grid class and animation */}
                <div ref={statsGridRef} className={`stats-grid ${styles.statsGrid}`}>
                    {statItems.map((item, index) => {
                         return (
                            <div
                                key={index}
                                // Use global stat-item class and animation trigger based on grid visibility
                                className={`stat-item ${statsGridInView ? `animate fade-up delay-${index % 4}` : 'animate'}`}
                            >
                                 {/* Use global stat-number/label classes */}
                                <div className="stat-number">{item.number}</div>
                                <div className="stat-label">{item.label}</div>
                            </div>
                         );
                     })}
                </div>

                {/* Why Different Section - Uses module styles and animation */}
                <div ref={whyDifferentRef} className={`${styles.whyDifferentSection} ${whyDifferentInView ? 'animate fade-up' : 'animate'}`}>
                    <div className={styles.whyDifferentContent}>
                        <h3>Why This Program Is Different</h3>
                        <p>Unlike programs that focus only on exercises, this course develops your unique medium voice and helps you find your authentic approach to spirit connection:</p>

                         {/* Use global highlight-box class */}
                        <div className={`highlight-box ${styles.highlightBox}`}>
                            <p>"Every medium thinks their way is the right way. So I find it very important that we all find our own way, your own unique way to follow your path."</p>
                        </div>

                        <p>My role is not to mold you into my image but to help you discover and refine your authentic voice. This systematic, 8+ month journey builds your skills progressively and addresses both the technical aspects of mediumship and the personal development required to work sustainably.</p>

                        {/* Tags Container - Attach ref here, NO animation classes */}
                        <div ref={tagsRef} className={styles.tagsContainer}>
                             {/* Apply animation to EACH tag, triggered by tagsInView */}
                             {tagItems.map((tag) => (
                                <span
                                    key={tag.label}
                                    // Use global tag class, module specific class, and conditional animation classes
                                    className={`tag ${styles.tagItem} ${tagsInView ? `animate fade-up delay-${tag.delay}` : 'animate'}`}
                                >
                                    {tag.label}
                                </span>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutProgram;