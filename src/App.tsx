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
        // Debug check - log directly to console
        console.log('Facebook Pixel available?', typeof window.fbq === 'function');
        
        if (window.fbq) {
            console.log('Directly calling fbq PageView');
            window.fbq('track', 'PageView');
        } else {
            console.warn('Facebook Pixel not available (window.fbq is undefined)');
        }
        
        // Then call our server-side tracking
        metaEvents.pageView();
        
        setIsMobileMenuOpen(false); // Close menu on navigation
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

            {/* Conditionally render Header - navLinks prop REMOVED */}
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
                {/* Add a test button at the top for debugging */}
                <button 
                    onClick={() => {
                        if (window.fbq) {
                            console.log('Test button: Triggering PageView event');
                            window.fbq('track', 'PageView');
                            alert('PageView event triggered - check Pixel Helper');
                        } else {
                            console.error('Test button: Facebook Pixel not available');
                            alert('Facebook Pixel not available');
                        }
                    }}
                    style={{
                        padding: '10px 15px',
                        margin: '20px',
                        background: '#6C2996',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        position: 'fixed',
                        top: '0',
                        right: '0',
                        zIndex: '9999'
                    }}
                >
                    Test Meta Pixel
                </button>

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