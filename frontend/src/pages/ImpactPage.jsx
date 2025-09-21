import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import SlabButton from '../components/ui/SlabButton';
import blockchainService from '../services/blockchainService';

const ImpactPage = ({ user }) => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from blockchain
  useEffect(() => {
    const fetchImpactData = async () => {
      if (!user?.address) {
        setIsLoading(false);
        return;
      }

      try {
        // Initialize blockchain service if not already done
        if (window.ethereum) {
          await blockchainService.initialize(window.ethereum);
        }

        // Fetch donor impact data
        const impactData = await blockchainService.getDonorImpact(user.address);
        const donationHistory = await blockchainService.getDonorHistory(user.address);
        const activeRequests = await blockchainService.getActiveRequests();

        // Convert blockchain data to expected format
        const formattedDonations = donationHistory.map(donation => ({
          id: donation.id,
          amount: donation.amount,
          date: donation.date,
          method: donation.method,
          livesHelped: donation.livesHelped
        }));

        const formattedRequests = activeRequests.map(request => ({
          id: request.id,
          hospital: request.hospitalName,
          amount: request.amountRequested,
          funded: request.amountFunded,
          status: request.status === 'funded' ? 'completed' : 'partial',
          peopleHelped: request.peopleHelped
        }));

        setDonations(formattedDonations);
        setEmergencyRequests(formattedRequests);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching impact data:', error);
        
        // Fallback to mock data if blockchain fails
        const mockDonations = [
          { id: 1, amount: 25, date: '2024-01-15', method: 'FLR', livesHelped: 1 },
          { id: 2, amount: 50, date: '2024-01-10', method: 'USDC', livesHelped: 2 },
          { id: 3, amount: 15, date: '2024-01-05', method: 'XRPL', livesHelped: 1 },
          { id: 4, amount: 100, date: '2024-01-01', method: 'FLR', livesHelped: 4 },
        ];

        const mockRequests = [
          { id: 1, hospital: 'City General', amount: 500, funded: 500, status: 'completed', peopleHelped: 10 },
          { id: 2, hospital: 'Metro Health', amount: 300, funded: 300, status: 'completed', peopleHelped: 6 },
          { id: 3, hospital: 'Regional Medical', amount: 750, funded: 400, status: 'partial', peopleHelped: 8 },
          { id: 4, hospital: 'Emergency Care', amount: 200, funded: 200, status: 'completed', peopleHelped: 4 },
        ];

        setDonations(mockDonations);
        setEmergencyRequests(mockRequests);
        setIsLoading(false);
      }
    };

    fetchImpactData();
  }, [user]);

  // Calculate impact metrics
  const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalRequests = emergencyRequests.length;
  const completedRequests = emergencyRequests.filter(req => req.status === 'completed').length;
  const averagePerRequest = totalRequests > 0 ? totalDonated / totalRequests : 0;
  const peopleHelped = Math.floor(totalDonated / 50); // Assuming $50 average per person helped

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const numberVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink mb-4">Please connect your wallet</h1>
          <SlabButton
            variant="primary"
            label="Connect Wallet"
            onClick={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SlabButton
                variant="ghost"
                icon={<ArrowLeftIcon className="w-4 h-4" />}
                label="Back"
                onClick={() => navigate('/')}
                className="text-muted hover:text-ink"
              />
              <div>
                <h1 className="text-3xl font-bold text-ink">Your Impact</h1>
                <p className="text-muted">See how your donations are making a difference</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrophyIcon className="w-6 h-6 text-accent-2" />
              <span className="text-sm font-medium text-ink">Impact Tracker</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="slab-container">
                <div className="loading-skeleton h-32 w-full rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Impact Overview */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="slab-container"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-ink mb-2">Your Impact Overview</h2>
                <p className="text-muted">Here's how your contributions are helping people in need</p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <motion.div
                    variants={numberVariants}
                    animate="animate"
                    className="text-4xl font-bold text-accent-2 mb-2"
                  >
                    {peopleHelped}
                  </motion.div>
                  <div className="text-sm text-muted flex items-center justify-center">
                    <HeartIcon className="w-4 h-4 mr-1" />
                    Lives Helped
                  </div>
                </div>

                <div className="text-center">
                  <motion.div
                    variants={numberVariants}
                    animate="animate"
                    className="text-4xl font-bold text-accent-3 mb-2"
                  >
                    ${totalDonated}
                  </motion.div>
                  <div className="text-sm text-muted flex items-center justify-center">
                    <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                    Total Donated
                  </div>
                </div>

                <div className="text-center">
                  <motion.div
                    variants={numberVariants}
                    animate="animate"
                    className="text-4xl font-bold text-ink mb-2"
                  >
                    {completedRequests}
                  </motion.div>
                  <div className="text-sm text-muted flex items-center justify-center">
                    <TrophyIcon className="w-4 h-4 mr-1" />
                    Requests Funded
                  </div>
                </div>

                <div className="text-center">
                  <motion.div
                    variants={numberVariants}
                    animate="animate"
                    className="text-4xl font-bold text-accent mb-2"
                  >
                    ${averagePerRequest.toFixed(0)}
                  </motion.div>
                  <div className="text-sm text-muted flex items-center justify-center">
                    <ChartBarIcon className="w-4 h-4 mr-1" />
                    Avg per Request
                  </div>
                </div>
              </div>
            </motion.div>

            {/* How Your Money Helped */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="slab-container"
            >
              <h3 className="text-xl font-bold text-ink mb-6 flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2 text-accent-2" />
                How Your Money Helped
              </h3>
              
              <div className="space-y-4">
                {emergencyRequests.map((request, index) => {
                  const yourContribution = averagePerRequest;
                  const peopleHelpedByRequest = Math.floor(request.amount / 50);
                  const yourPeopleHelped = Math.floor((yourContribution / request.amount) * peopleHelpedByRequest);
                  
                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/30 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-ink">{request.hospital}</h4>
                          <p className="text-sm text-muted">Emergency Request #{request.id}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-accent-2">
                            ${yourContribution.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted">Your contribution</div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-ink">{yourPeopleHelped}</div>
                          <div className="text-muted">People you helped</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-ink">${request.amount}</div>
                          <div className="text-muted">Total request amount</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-ink capitalize">{request.status}</div>
                          <div className="text-muted">Status</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Donation History */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="slab-container"
            >
              <h3 className="text-xl font-bold text-ink mb-6 flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-accent-3" />
                Your Donation History
              </h3>
              
              <div className="space-y-3">
                {donations.map((donation, index) => (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent-2 rounded-full flex items-center justify-center">
                        <HeartIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-ink">${donation.amount} via {donation.method}</div>
                        <div className="text-sm text-muted">
                          {new Date(donation.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-accent-2">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactPage;