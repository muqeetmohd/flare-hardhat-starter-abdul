import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  UserGroupIcon,
  TrophyIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import blockchainService from '../../services/blockchainService';

const ImpactTracker = ({ user, donations = [], emergencyRequests = [] }) => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [realData, setRealData] = useState({
    totalDonated: 0,
    totalLivesHelped: 0,
    donationCount: 0
  });

  // Fetch real impact data from blockchain
  useEffect(() => {
    const fetchRealData = async () => {
      if (!user?.address) return;

      try {
        if (window.ethereum) {
          await blockchainService.initialize(window.ethereum);
          const impactData = await blockchainService.getDonorImpact(user.address);
          setRealData(impactData);
        }
      } catch (error) {
        console.error('Error fetching real impact data:', error);
      }
    };

    fetchRealData();
  }, [user]);

  // Calculate impact metrics (use real data if available, fallback to props)
  const totalDonated = realData.totalDonated || donations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalRequests = emergencyRequests.length;
  const averagePerRequest = totalRequests > 0 ? totalDonated / totalRequests : 0;
  const peopleHelped = realData.totalLivesHelped || Math.floor(totalDonated / 50); // Use real data or fallback
  const recentDonations = donations.slice(-3);

  // Trigger animation when numbers change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [totalDonated, peopleHelped]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const numberVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  const handleViewImpact = () => {
    navigate('/impact');
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Main Impact Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="slab-container relative overflow-hidden group cursor-pointer"
        onClick={handleViewImpact}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-accent-2/10 to-accent-3/10"
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-0 right-0 w-20 h-20 bg-accent-2 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-accent-2 to-accent-3 rounded-full flex items-center justify-center"
                animate={isAnimating ? { rotate: [0, 360] } : {}}
                transition={{ duration: 0.8 }}
              >
                <TrophyIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-ink">Your Impact</h3>
                <p className="text-sm text-muted">Lives you've helped save</p>
              </div>
            </div>
            
            <motion.div
              animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.6 }}
            >
              <SparklesIcon className="w-6 h-6 text-accent-2" />
            </motion.div>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <motion.div
                variants={numberVariants}
                animate={isAnimating ? "animate" : {}}
                className="text-4xl font-bold text-accent-2 mb-2"
              >
                {peopleHelped.toLocaleString()}
              </motion.div>
              <div className="text-sm text-muted flex items-center justify-center">
                <HeartIcon className="w-4 h-4 mr-1" />
                Lives Helped
              </div>
            </div>
            
            <div className="text-center">
              <motion.div
                variants={numberVariants}
                animate={isAnimating ? "animate" : {}}
                className="text-4xl font-bold text-accent-3 mb-2"
              >
                ${totalDonated.toLocaleString()}
              </motion.div>
              <div className="text-sm text-muted flex items-center justify-center">
                <UserGroupIcon className="w-4 h-4 mr-1" />
                Total Donated
              </div>
            </div>
          </div>

          {/* Equal Distribution Explanation */}
          <div className="bg-white/50 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-semibold text-ink mb-2">How Your Money Helps</h4>
            <p className="text-xs text-muted leading-relaxed">
              Your ${totalDonated} was distributed equally among {totalRequests} emergency requests. 
              Each request received ${averagePerRequest.toFixed(2)} from your donations.
            </p>
          </div>

          {/* View Impact Button */}
          <motion.div
            className="flex items-center justify-between text-sm text-accent-2 font-medium"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span>View detailed impact</span>
            <ArrowRightIcon className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Hover Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent-2/5 to-accent-3/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </motion.div>

      {/* Recent Donations */}
      {recentDonations.length > 0 && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="slab-container"
        >
          <h4 className="text-lg font-bold text-ink mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-accent-2" />
            Recent Donations
          </h4>
          <div className="space-y-3">
            {recentDonations.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent-2 rounded-full flex items-center justify-center">
                    <HeartIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-ink">${donation.amount}</div>
                    <div className="text-xs text-muted flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {new Date(donation.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-accent-2">
                    {Math.floor(donation.amount / 50)} people helped
                  </div>
                  <div className="text-xs text-muted">
                    ${(donation.amount / totalRequests).toFixed(2)} per request
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImpactTracker;
