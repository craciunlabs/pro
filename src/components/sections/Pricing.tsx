// src/components/sections/Pricing.tsx
import React from 'react';
import styles from './Pricing.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useInView } from 'react-intersection-observer';
import metaEvents from '../../utils/meta-event'; // Import the metaEvents utility

declare global { interface Window { fbq?: (...args: any[]) => void; } }

const Pricing: React.FC = () => {
    const { ref: sectionRef, inView: sectionInView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: bannerRef, inView: bannerInView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: card1Ref, inView: card1InView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: card2Ref, inView: card2InView } = useInView({ triggerOnce: true, threshold: 0.1, delay: 100 });
    const { ref: noteRef, inView: noteInView } = useInView({ triggerOnce: true, threshold: 0.1, delay: 200 });

    const handleButtonClick = (planType: 'full' | 'deposit') => {
      const isFullPayment = planType === 'full';
      const eventData = {
          content_name: `Progressive Mediumship Course 2025 - ${isFullPayment ? 'Full Payment' : 'Payment Plan'}`,
          content_ids: [isFullPayment ? 'PMC2025-FULL' : 'PMC2025-PLAN'],
          content_type: 'product', 
          currency: 'EUR',
          value: isFullPayment ? 1295 : 395,
      };
      
      // Client-side Meta Pixel tracking (existing)
      if (window.fbq) { 
          window.fbq('track', 'InitiateCheckout', eventData); 
      }
      else { 
          console.warn('Meta Pixel (fbq) not loaded.'); 
      }
      
      // Add server-side Meta CAPI tracking
      metaEvents.initiateCheckout({
          value: isFullPayment ? 1295 : 395,
          currency: 'EUR',
          content_ids: [isFullPayment ? 'PMC2025-FULL' : 'PMC2025-PLAN'],
          content_name: `Progressive Mediumship Course 2025 - ${isFullPayment ? 'Full Payment' : 'Payment Plan'}`,
          content_type: 'product'
      });
    };

    return (
        <section ref={sectionRef} className={`section ${styles.pricingSection}`} id="pricing">
            <div className="container">
                <div className={`section-heading ${sectionInView ? 'animate fade-up' : 'animate'}`}>
                    <span className="section-subtitle">Join the 2025 Program</span>
                    <h2>Secure Your Place Today</h2>
                    <p>Choose the payment option that works best for you</p>
                </div>

                <div ref={bannerRef} className={`banner ${styles.pricingBanner} ${bannerInView ? 'animate fade-up' : 'animate'}`}>
                    <div className="banner-icon"><FontAwesomeIcon icon={faExclamationCircle} /></div>
                    <div>Only 2 spaces remaining -- 10 spots already taken!</div>
                </div>

                <div className={styles.pricingGrid}>
                    {/* Card 1 */}
                    <div ref={card1Ref} className={`${styles.pricingCard} ${card1InView ? 'animate fade-up' : 'animate'}`}>
                        <div className={styles.pricingHeader}>
                            <div className={styles.pricingTitle}>FULL PAYMENT</div>
                            <div className={styles.pricingPrice}>€1295</div>
                            <div className={styles.pricingPeriod}>Save €100</div>
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
                            <a href="https://calendly.com/miaottosson/progressive-mediumship-2025/2025-04-09T18:00:00+02:00?month=2025-04&date=2025-04-09" target="_blank" rel="noopener noreferrer" className={`btn btn-primary btn-block ${styles.pricingButton}`} onClick={() => handleButtonClick('full')}>Pay in Full</a>
                            <p className={styles.pricingNote}><small>Early registration ends April 8th, 2025</small></p>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div ref={card2Ref} className={`${styles.pricingCard} ${card2InView ? `animate fade-up` : 'animate'}`}>
                        <div className={styles.pricingHeader}>
                            <div className={styles.pricingTitle}>PAYMENT PLAN</div>
                            <div className={styles.pricingPrice}>€1395</div>
                            <div className={styles.pricingPeriod}>€395 deposit + 2 x €500</div>
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
                             <a href="https://calendly.com/miaottosson/progressive-mediumship-2025-deposit/2025-04-08T18:00:00+02:00?month=2025-04&date=2025-04-08" target="_blank" rel="noopener noreferrer" className={`btn btn-primary btn-block ${styles.pricingButton}`} onClick={() => handleButtonClick('deposit')}>Choose Payment Plan</a>
                            <p className={styles.pricingNote}><small>Please note: No BONUS private sessions for this option</small></p>
                        </div>
                    </div>
                </div>

                {/* Note Container */}
                <div ref={noteRef} className={`${styles.refundNoteContainer} ${noteInView ? `animate fade-up` : 'animate'}`}>
                    <p className={styles.refundNoteText}>Please note: Due to the intensive nature of this personalized program and limited spots available, we are unable to offer refunds. By joining, you are committing to your complete development journey.</p>
                    <p className={styles.bonusSessionNote}>*The bonus 1.5-hour private session included with the Full Payment option is dedicated time for discussing your personal mediumship development journey with Mia, not for private reading appointments.</p>
                </div>
            </div>
        </section>
    );
};

export default Pricing;