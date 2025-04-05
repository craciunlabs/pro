// src/components/ui/CountdownTimer.tsx
import React, { useState, useEffect } from 'react';
import styles from './CountdownTimer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useInView } from 'react-intersection-observer';

interface CountdownTimerProps {
  targetDate: Date;
  totalStudents?: number;
  spotsTaken?: number;
  spotsRemaining?: number;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate, 
  totalStudents = 14, 
  spotsTaken, 
  spotsRemaining = 3,
  className = ''
}) => {
  // Calculate spotsTaken if not provided but spotsRemaining is
  const calculatedSpotsTaken = spotsTaken || (totalStudents - spotsRemaining);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  });
  
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        });
      } else {
        // Course has started
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatTime = (time: number) => {
    return time.toString().padStart(2, '0');
  };

  return (
    <div 
      ref={ref} 
      className={`${styles.countdownWrapper} ${inView ? 'animate fade-up' : 'animate'} ${className}`}
    >
      <div className={styles.countdownContainer}>
        <div className={styles.countdownHeader}>
          <div className={styles.countdownTitle}>Registration closes in:</div>
          <div className={styles.nowOrNext}>Join now or wait until next year</div>
        </div>
        <div className={styles.countdown}>
          <div className={styles.countdownItem}>
            <div className={styles.countdownNumber}>{formatTime(timeLeft.days)}</div>
            <div className={styles.countdownLabel}>Days</div>
          </div>
          <div className={styles.countdownDivider}>:</div>
          <div className={styles.countdownItem}>
            <div className={styles.countdownNumber}>{formatTime(timeLeft.hours)}</div>
            <div className={styles.countdownLabel}>Hours</div>
          </div>
          <div className={styles.countdownDivider}>:</div>
          <div className={styles.countdownItem}>
            <div className={styles.countdownNumber}>{formatTime(timeLeft.minutes)}</div>
            <div className={styles.countdownLabel}>Minutes</div>
          </div>
        </div>
      </div>
      <div className={styles.limitedOffer}>
        <span className={styles.limitedOfferIcon}><FontAwesomeIcon icon={faStar} /></span>
        <span>
          Limited to {totalStudents} students - <span className={styles.spotsHighlight}>{calculatedSpotsTaken} spots taken!</span>
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;