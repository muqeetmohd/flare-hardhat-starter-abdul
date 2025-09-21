import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/layout/Navbar';
import { ToastContainer } from './components/ui/Toast';
import AnimatedLoader from './components/ui/AnimatedLoader';

// Pages
import HomePage from './pages/HomePage';
import HospitalDashboard from './pages/HospitalDashboard';
import RequestsPage from './pages/RequestsPage';
import ImpactPage from './pages/ImpactPage';
import ProfilePage from './pages/ProfilePage';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useWeb3 } from './hooks/useWeb3';

// Services
import blockchainService from './services/blockchainService';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const { connectWallet, disconnectWallet, isConnected, account, signMessage, isMetaMaskInstalled, provider, signer } = useWeb3();
  const { login, loginWithWallet, logout, register } = useAuth();

  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      try {
        // Check for stored user session
        const storedUser = localStorage.getItem('flarehelp_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // Initialize blockchain service when provider is available
  useEffect(() => {
    if (provider) {
      blockchainService.initialize(provider, signer);
    }
  }, [provider, signer]);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled) {
      showToast('error', 'MetaMask Required', 'Please install MetaMask to connect your wallet');
      return;
    }

    try {
      const walletAccount = await connectWallet();
      
      if (walletAccount) {
        // Create a message to sign
        const message = `Welcome to FlareHelp! Please sign this message to authenticate your wallet.\n\nWallet: ${walletAccount}\nTimestamp: ${Date.now()}`;
        
        // Sign the message
        const signature = await signMessage(message);
        
        // Login with wallet signature
        const userData = await loginWithWallet({
          walletAddress: walletAccount,
          signature: signature,
          message: message
        });
        
        if (userData) {
          setUser(userData);
          localStorage.setItem('flarehelp_user', JSON.stringify(userData));
          showToast('success', 'Wallet Connected', 'Successfully connected to your wallet');
        } else {
          showToast('error', 'Login Failed', 'Failed to authenticate with the server');
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      showToast('error', 'Connection Failed', error.message || 'Failed to connect wallet. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setUser(null);
    localStorage.removeItem('flarehelp_user');
    disconnectWallet();
    showToast('info', 'Logged Out', 'You have been logged out successfully');
  };

  // Toast system
  const showToast = (type, title, message, action = null) => {
    const id = Date.now().toString();
    const toast = {
      id,
      type,
      title,
      message,
      action,
      duration: type === 'error' ? 0 : 5000 // Errors don't auto-dismiss
    };
    
    setToasts(prev => [...prev, toast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Handle donation
  const handleDonate = async (requestId = null) => {
    if (!user) {
      showToast('info', 'Login Required', 'Please connect your wallet to donate');
      return;
    }

    try {
      // Simulate donation process
      showToast('info', 'Processing Donation', 'Please confirm the transaction in your wallet...');
      
      // Simulate transaction
      setTimeout(() => {
        showToast('success', 'Donation Successful', 'Your $5 donation has been processed!', {
          label: 'View Impact',
          onClick: () => console.log('View impact')
        });
      }, 2000);
    } catch (error) {
      console.error('Donation error:', error);
      showToast('error', 'Donation Failed', 'Your wallet rejected the transaction');
    }
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: [0.2, 0.9, 0.25, 1],
    duration: 0.3
  };

  if (isLoading) {
    return <AnimatedLoader message="Loading FlareHelp..." />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-bg">
          <Navbar
            user={user}
            onConnectWallet={handleConnectWallet}
            onLogout={handleLogout}
            notifications={notifications}
          />
          
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <HomePage
                      user={user}
                      onDonate={handleDonate}
                      onConnectWallet={handleConnectWallet}
                    />
                  </motion.div>
                }
              />
              
              <Route
                path="/hospital"
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <HospitalDashboard
                      user={user}
                      onCreateRequest={(data) => console.log('Create request:', data)}
                    />
                  </motion.div>
                }
              />
              
              <Route
                path="/requests"
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <RequestsPage
                      user={user}
                      onDonate={handleDonate}
                    />
                  </motion.div>
                }
              />
              
              <Route
                path="/impact"
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <ImpactPage user={user} />
                  </motion.div>
                }
              />
              
              <Route
                path="/profile"
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <ProfilePage user={user} />
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </div>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} onClose={removeToast} />
        
        {/* React Hot Toast */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--panel)',
              color: 'var(--ink)',
              border: '2px solid rgba(11,13,15,0.12)',
              borderRadius: '8px',
              fontFamily: 'var(--font-ui)',
            },
            success: {
              iconTheme: {
                primary: 'var(--accent-2)',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--accent)',
                secondary: 'white',
              },
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
