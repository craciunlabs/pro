// src/App.tsx

// --- Import React Hooks and Router ---
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// --- Import Layout and UI Components ---
import SkipLink from './components/ui/SkipLink';
import Header from './components/sections/Header';
import MobileMenu from './components/sections/MobileMenu';
import Footer from './components/sections/Footer';
import MobileBottomBar from './components/sections/MobileBottomBar';
import StickyBanner from './components/ui/StickyBanner';

// --- Import Page Components ---
import LandingPage from './pages/LandingPage';
import ThankYouPage from './pages/ThankYouPage';

// --- Import Meta Events Utility ---
import metaEvents from './utils/meta-event';

// Declare fbq global function for TypeScript
declare global { interface Window { fbq?: (...args: any[]) => void; } }

// --- Main App Component ---
function App() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMobileMenu = () => { setIsMobileMenuOpen(prevState => !prevState); };

    // Effect to control body scrolling
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    // Effect for Meta Pixel PageView Tracking & closing mobile menu
    useEffect(() => {
        // Track page view and close mobile menu on navigation
        metaEvents.pageView();
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Effect to add margin to body when sticky banner is shown
    useEffect(() => {
        if (!location.pathname.includes('thank-you')) {
            // Add padding to body to account for sticky banner
            document.body.style.paddingTop = '34px';
        } else {
            document.body.style.paddingTop = '0';
        }
        
        return () => {
            document.body.style.paddingTop = '0';
        };
    }, [location.pathname]);

    // Navigation links data (still needed for MobileMenu and Footer)
    const navLinks = [
        { href: "/#about", label: "About the Program" }, { href: "/#about-mentor", label: "About Mia" },
        { href: "/#schedule", label: "Class Schedule" }, { href: "/#curriculum", label: "What You'll Learn" },
        { href: "/#bonus", label: "Bonus Masterclass" }, { href: "/#testimonials", label: "Success Stories" },
        { href: "/#pricing", label: "Join Now" }, { href: "/#faq", label: "FAQ" }
    ];

    const isThankYouPage = location.pathname === '/thank-you';

    // --- Render the application's UI structure ---
    return (
        <>
            <SkipLink targetId="main-content" />

            {/* Add StickyBanner - only show on landing page, not thank-you */}
            {!isThankYouPage && <StickyBanner spotsRemaining={1} />}

            {/* Conditionally render Header - only include the menu toggle button */}
            {!isThankYouPage && (
                <Header onMenuToggle={toggleMobileMenu} />
            )}

            {/* Conditionally render MobileMenu - navLinks prop KEPT */}
            {!isThankYouPage && (
                <MobileMenu
                    isOpen={isMobileMenuOpen}
                    onClose={toggleMobileMenu}
                    navLinks={navLinks}
                />
            )}

            <main id="main-content" role="main">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/thank-you" element={<ThankYouPage />} />
                </Routes>
            </main>

            {/* Conditionally render Footer - navLinks prop KEPT */}
            {!isThankYouPage && (
                <Footer navLinks={navLinks} />
            )}

            {/* Conditionally render MobileBottomBar */}
            {!isThankYouPage && (
                <MobileBottomBar />
            )}
        </>
    );
}

export default App;