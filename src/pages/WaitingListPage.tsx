import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WaitingListPage.module.css';

const WaitingListPage: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Here you would typically send the data to your backend
            // For now, we'll just simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Store the data in localStorage for now
            const waitingList = JSON.parse(localStorage.getItem('waitingList') || '[]');
            waitingList.push({ firstName, email, date: new Date().toISOString() });
            localStorage.setItem('waitingList', JSON.stringify(waitingList));
            
            setSuccess(true);
            
            // Redirect to thank you page after 3 seconds
            setTimeout(() => {
                navigate('/thank-you');
            }, 3000);
        } catch (err) {
            setError('There was an error submitting your information. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.waitingListContainer}>
            <div className={styles.waitingListContent}>
                <h1>Join the Waiting List for 2026</h1>
                <p className={styles.waitingListDescription}>
                    The Progressive Mediumship program is sold out for 2025. 
                    Join our waiting list to be the first to know when registration opens for 2026.
                </p>
                
                {success ? (
                    <div className={styles.successMessage}>
                        <h2>Thank You!</h2>
                        <p>You've been added to our waiting list for 2026.</p>
                        <p>We'll contact you as soon as registration opens.</p>
                        <p>Redirecting to confirmation page...</p>
                    </div>
                ) : (
                    <form className={styles.waitingListForm} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                placeholder="Your first name"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your.email@example.com"
                            />
                        </div>
                        
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Join Waiting List'}
                        </button>
                        
                        <p className={styles.privacyNote}>
                            We respect your privacy. Your information will not be shared with third parties.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default WaitingListPage; 