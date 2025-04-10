import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WaitingListPage.module.css';
import { addToWaitingList, checkEmailExists } from '../utils/supabase';

const WaitingListPage: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // useEffect to handle redirect after submission
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (submitted) {
            timer = setTimeout(() => {
                navigate('/');
            }, 10000); // Change 15000 to 10000 (10 seconds delay)
        }
        // Cleanup function to clear the timeout if the component unmounts
        // or if submitted becomes false before the timeout finishes
        return () => clearTimeout(timer);
    }, [submitted, navigate]); // Dependencies for the effect

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Check if email already exists in waiting list
            const { exists: emailExists } = await checkEmailExists(email);
            
            if (emailExists) {
                setError('This email is already on our waiting list.');
                setIsSubmitting(false);
                return;
            }
            
            // Email does not exist, add to waiting list
            const { error: insertError } = await addToWaitingList({
                first_name: firstName,
                email: email,
            });

            if (insertError) {
                console.error("Error adding to waiting list:", insertError);
                setError("There was an error submitting your information. Please try again.");
            } else {
                setSubmitted(true);
                setError(null); // Clear any previous errors
            }
        } catch (err) {
            console.error('Submission error:', err);
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
                
                {submitted ? (
                    <div className={styles.successMessage}>
                        <h2>Thank You!</h2>
                        <p>You've been added to our waiting list for 2026.</p>
                        <p>We'll contact you as soon as registration opens.</p>
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