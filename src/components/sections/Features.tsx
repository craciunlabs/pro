import React from 'react';
import styles from './Features.module.css';
import { useInView } from 'react-intersection-observer';

const Features: React.FC = () => {
    const { ref: sectionRef } = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section ref={sectionRef} className={`section ${styles.featuresSection}`} id="features">
            <div className="container">
                <div className={styles.featuresHeader}>
                    <h2>Program Features</h2>
                    <p>Join our waiting list for 2026 to secure your spot in this transformative journey</p>
                    <a href="https://calendly.com/miaottosson/waiting-list-2026" className="btn btn-primary">Join Waiting List</a>
                </div>
                
                {/* Features content will go here */}
            </div>
        </section>
    );
};

export default Features; 