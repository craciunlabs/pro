// src/components/ui/CountdownTimer.tsx
import React, { useState, useEffect } from 'react';
import styles from './CountdownTimer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface CountdownTimerProps {
  targetDate: Date;
  totalStudents: number;
  spotsRemaining: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate, 
  totalStudents, 
  spotsRemaining 
}) => {
  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const padWithZero = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  const spotsTaken = totalStudents - spotsRemaining;

  return (
    <div className={styles.countdownWrapper}>
      <div className={styles.countdownContainer}>
        <div className={styles.countdownHeader}>
          <span className={styles.countdownTitle}>Registration closes in:</span>
          <span className={styles.nowOrNext}>Join now or wait until next year</span>
        </div>
        <div className={styles.countdown}>
          <div className={styles.countdownItem}>
            <div className={styles.countdownNumber}>
              {padWithZero(timeLeft.days)}
            </div>
            <span className={styles.countdownLabel}>DAYS</span>
          </div>
          <span className={styles.countdownDivider}>:</span>
          <div className={styles.countdownItem}>
            <div className={styles.countdownNumber}>
              {padWithZero(timeLeft.hours)}
            </div>
            <span className={styles.countdownLabel}>HOURS</span>
          </div>
          <span className={styles.countdownDivider}>:</span>
          <div className={styles.countdownItem}>
            <div className={styles.countdownNumber}>
              {padWithZero(timeLeft.minutes)}
            </div>
            <span className={styles.countdownLabel}>MINUTES</span>
          </div>
        </div>
      </div>
      
      <div className={styles.limitedOffer}>
        <FontAwesomeIcon icon={faStar} className={styles.limitedOfferIcon} /> 
        Limited to {totalStudents} students - <span className={styles.spotsHighlight}>{spotsTaken} spots taken!</span>
      </div>
    </div>
  );
};

export default CountdownTimer;