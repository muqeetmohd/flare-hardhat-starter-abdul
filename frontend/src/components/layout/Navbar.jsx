import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { 
  Bars3Icon, 
  XMarkIcon, 
  BellIcon, 
  UserCircleIcon,
  WalletIcon
} from '@heroicons/react/24/outline';
import SlabButton from '../ui/SlabButton';

const Navbar = ({ 
  user, 
  onConnectWallet, 
  onLogin, 
  onLogout,
  notifications = [],
  className 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.2, ease: [0.2, 0.9, 0.25, 1] }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.15 }
    }
  };

  return (
    <motion.nav
      className={clsx(
        'navbar bg-panel border-b-2 border-[rgba(11,13,15,0.06)] sticky top-0 z-50',
        className
      )}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <a href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">FH</span>
            </div>
            <span className="font-display text-xl font-bold text-ink uppercase tracking-tight">
              FlareHelp
            </span>
          </a>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-ink hover:text-accent transition-colors font-medium">
            Home
          </a>
          <a href="/requests" className="text-ink hover:text-accent transition-colors font-medium">
            Emergency Requests
          </a>
          <a href="/impact" className="text-ink hover:text-accent transition-colors font-medium">
            Your Impact
          </a>
          <a href="/about" className="text-ink hover:text-accent transition-colors font-medium">
            How It Works
          </a>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {user && (
            <motion.button
              className="relative p-2 text-ink hover:text-accent transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BellIcon className="w-6 h-6" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadNotifications}
                </span>
              )}
            </motion.button>
          )}

          {/* User Menu or Connect Wallet */}
          {user ? (
            <div className="relative">
              <motion.button
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-white transition-colors"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserCircleIcon className="w-6 h-6 text-ink" />
                <span className="hidden sm:block text-ink font-medium">
                  {user.username}
                </span>
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-panel border-2 border-[rgba(11,13,15,0.12)] rounded-md shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="py-1">
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-ink hover:bg-white transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </a>
                      <a
                        href="/donations"
                        className="block px-4 py-2 text-sm text-ink hover:bg-white transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Donations
                      </a>
                      <a
                        href="/badges"
                        className="block px-4 py-2 text-sm text-ink hover:bg-white transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Badges
                      </a>
                      {user.role === 'hospital' && (
                        <a
                          href="/hospital"
                          className="block px-4 py-2 text-sm text-ink hover:bg-white transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Hospital Dashboard
                        </a>
                      )}
                      <hr className="my-1 border-[rgba(11,13,15,0.06)]" />
                      <button
                        onClick={() => {
                          onLogout?.();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-ink hover:bg-white transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <SlabButton
              variant="primary"
              size="md"
              icon={<WalletIcon className="w-4 h-4" />}
              label="Connect Wallet"
              onClick={() => {
                console.log('Connect wallet button clicked in Navbar');
                onConnectWallet?.();
              }}
            />
          )}

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-ink hover:text-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-panel border-t-2 border-[rgba(11,13,15,0.06)]"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-4 py-4 space-y-2">
              <a
                href="/"
                className="block py-2 text-ink hover:text-accent transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/requests"
                className="block py-2 text-ink hover:text-accent transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Emergency Requests
              </a>
              <a
                href="/impact"
                className="block py-2 text-ink hover:text-accent transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Your Impact
              </a>
              <a
                href="/about"
                className="block py-2 text-ink hover:text-accent transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </a>
              {!user && (
                <div className="pt-4">
                  <SlabButton
                    variant="primary"
                    size="md"
                    icon={<WalletIcon className="w-4 h-4" />}
                    label="Connect Wallet"
                    onClick={() => {
                      console.log('Connect wallet button clicked in mobile menu');
                      onConnectWallet?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
