// src/components/sections/Pricing.tsx
import React from 'react';
import styles from './Pricing.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useInView } from 'react-intersection-observer';

declare global { interface Window { fbq?: (...args: any[]) => void; } }

const Pricing: React.FC = () => {
    const { ref: sectionRef } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: bannerRef, inView: bannerInView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: card1Ref, inView: card1InView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: card2Ref, inView: card2InView } = useInView({ triggerOnce: true, threshold: 0.1, delay: 100 });
    const { ref: noteRef, inView: noteInView } = useInView({ triggerOnce: true, threshold: 0.1, delay: 200 });

    return (
        <section ref={sectionRef} className={`section ${styles.pricingSection}`} id="pricing">
            <div className="container">
                <div ref={bannerRef} className={`banner ${styles.pricingBanner} ${bannerInView ? 'animate fade-up' : 'animate'}`}>
                    <div className="banner-icon"><FontAwesomeIcon icon={faExclamationCircle} /></div>
                    <div>Program is now SOLD OUT! Join the waiting list for 2026</div>
                </div>

                <div className="section-heading" style={{ marginBottom: '40px' }}> 
                    <h2>Investment Options</h2>
                    <p>The 2025 program is sold out. Join the waiting list for 2026.</p>
                </div>

                <div className={styles.pricingGrid}>
                    {/* Card 1 */}
                    <div ref={card1Ref} className={`${styles.pricingCard} ${card1InView ? 'animate fade-up' : 'animate'}`}>
                        <div className={styles.pricingCardHeader}>
                          <h3 className={styles.pricingTitle}>FULL PAYMENT</h3>
                          <div className={styles.priceContainer}>
                            <span className={styles.currency}>€</span>
                            <span className={styles.price}>1295</span>
                          </div>
                          <p className={styles.pricingDescription}>Save €100</p>
                        </div>
                        <div className={styles.pricingBody}>
                            <ul className={styles.pricingFeatures}>
                                <li>All sessions over 8+ months</li>
                                <li className={styles.premiumFeature}><strong>One 1.5 hour private session with Mia</strong> <span className={styles.premiumValue}>(worth €300)</span></li>
                                <li>40+ hours of live training</li>
                                <li>Recordings available for 30 days</li>
                                <li>BONUS: The Mind-Spirit Connection Masterclass (€297 value)</li>
                                <li>Early registration savings of €100</li>
                                <li>Supportive community access</li>
                            </ul>
                            <a href="/waiting-list" className={`btn btn-primary btn-block ${styles.pricingButton}`}>Join Waiting List</a>
                            <p className={styles.pricingNote}><small>Waiting list for 2026 program now open</small></p>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div ref={card2Ref} className={`${styles.pricingCard} ${card2InView ? 'animate fade-up' : 'animate'}`}>
                        <div className={styles.pricingCardHeader}>
                          <h3 className={styles.pricingTitle}>PAYMENT PLAN</h3>
                          <div className={styles.priceContainer}>
                            <span className={styles.currency}>€</span>
                            <span className={styles.price}>395</span>
                            <span className={styles.period}>Deposit</span>
                          </div>
                           <p className={styles.pricingDescription}>+ 2 payments of €500</p>
                        </div>
                        <div className={styles.pricingBody}>
                            <ul className={styles.pricingFeatures}>
                                <li>All sessions over 8+ months</li>
                                <li className={styles.negativeFeature}>One 1.5 hour private session with Mia</li>
                                <li>40+ hours of live training</li>
                                <li>Recordings available for 30 days</li>
                                <li>BONUS: The Mind-Spirit Connection Masterclass (€297 value)</li>
                                <li>€395 deposit due at registration</li>
                                <li>2 remaining payments of €500 every 3 months</li>
                            </ul>
                            <a href="/waiting-list" className={`btn btn-primary btn-block ${styles.pricingButton}`}>Join Waiting List</a>
                            <p className={styles.pricingNote}><small>Waiting list for 2026 program now open</small></p>
                        </div>
                    </div>
                </div>

                {/* Note Container */}
                <div ref={noteRef} className={`${styles.refundNoteContainer} ${noteInView ? 'animate fade-up' : 'animate'}`}>
                    <p className={styles.refundNoteText}>Please note: Due to the intensive nature of this personalized program and limited spots available, we are unable to offer refunds. By joining, you are committing to your complete development journey.</p>
                    <p className={styles.bonusSessionNote}>*The bonus 1.5-hour private session included with the Full Payment option is dedicated time for discussing your personal mediumship development journey with Mia, not for private reading appointments.</p>
                </div>
            </div>
        </section>
    );
};

export default Pricing;