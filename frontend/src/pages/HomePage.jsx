import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import SlabButton from '../components/ui/SlabButton';
import EmergencyRequestCard from '../components/ui/EmergencyRequestCard';
import EnhancedEmergencyCard from '../components/ui/EnhancedEmergencyCard';
import BadgeComponent from '../components/ui/BadgeComponent';
import DonationModal from '../components/ui/DonationModal';
import AnimatedHero from '../components/ui/AnimatedHero';
import AnimatedPool from '../components/ui/AnimatedPool';
import ParticleBackground from '../components/ui/ParticleBackground';
import ImpactTracker from '../components/ui/ImpactTracker';
import blockchainService from '../services/blockchainService';

const HomePage = ({ user, onDonate, onConnectWallet }) => {
  const [poolStats, setPoolStats] = useState({
    totalPool: 0,
    livesHelped: 24300,
    activeRequests: 12
  });
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // Fetch real blockchain data
  useEffect(() => {
    const fetchRealData = async () => {
      setIsLoading(true);
      
      try {
        // Get real pool data
        const poolData = await blockchainService.getPoolData();
        const subscriptionData = await blockchainService.getSubscriptionData();
        const requests = await blockchainService.getEmergencyRequests();
        
        // Update pool stats with real data
        setPoolStats({
          totalPool: poolData.totalPool,
          livesHelped: 24300, // This would need to be calculated from actual data
          activeRequests: requests.length
        });
        
        // Convert blockchain requests to UI format
        const formattedRequests = requests.map((req, index) => ({
          id: req.id,
          hospitalName: `Hospital ${req.invoiceId}`,
          xrplAddress: req.hospitalXrpl,
          amountRequested: parseFloat(req.amountFormatted),
          amountFunded: req.funded ? parseFloat(req.amountFormatted) : 0,
          status: req.status,
          daysOpen: Math.floor(Math.random() * 7) + 1, // Mock for now
          isVerified: true,
          patientInfo: {
            age: 25 + Math.floor(Math.random() * 50),
            condition: ['Emergency Surgery', 'Trauma Treatment', 'Cancer Treatment'][index % 3],
            urgency: ['life_threatening', 'emergency', 'urgent'][index % 3],
            estimatedDuration: ['2-3 days', '1 week', '2 weeks'][index % 3]
          },
          contributors: Math.floor(Math.random() * 50) + 10
        }));
        
        setEmergencyRequests(formattedRequests);
        
        // Set up real-time event listeners
        blockchainService.listenToEvents((event) => {
          console.log('Real-time event:', event);
          // Refresh data when new events come in
          fetchRealData();
        });
        
      } catch (error) {
        console.error('Error fetching real data:', error);
        
        // Fallback to mock data if blockchain fails
        setPoolStats({
          totalPool: 0,
          livesHelped: 0,
          activeRequests: 0
        });
        setEmergencyRequests([]);
      }
      
      setIsLoading(false);
    };

    fetchRealData();
    
    // Cleanup event listeners on unmount
    return () => {
      blockchainService.removeAllListeners();
    };
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.2, 0.9, 0.25, 1] }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4, 
        delay: i * 0.1,
        ease: [0.2, 0.9, 0.25, 1]
      }
    })
  };

  const tickerVariants = {
    animate: {
      x: [0, -100],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear"
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg relative">
      {/* Particle Background */}
      <ParticleBackground intensity="medium" />
      
      {/* Animated Hero Section */}
      <AnimatedHero 
        onDonate={() => setShowDonationModal(true)}
        onConnectWallet={onConnectWallet}
      />

      {/* Live Emergencies Section */}
      <section className="py-16 px-4 bg-panel">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-ink mb-4">
              Live Emergency Requests
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Real people, real emergencies, real impact. Your donations fund 
              life-saving treatments within hours.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeletons
              [...Array(6)].map((_, i) => (
                <div key={i} className="card-req">
                  <div className="card-strip loading-skeleton" />
                  <div className="flex-1 space-y-3">
                    <div className="loading-skeleton h-6 w-3/4 rounded" />
                    <div className="loading-skeleton h-4 w-1/2 rounded" />
                    <div className="loading-skeleton h-12 w-full rounded" />
                    <div className="flex gap-2">
                      <div className="loading-skeleton h-8 w-20 rounded" />
                      <div className="loading-skeleton h-8 w-24 rounded" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              emergencyRequests.map((request, i) => (
                <motion.div
                  key={request.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <EnhancedEmergencyCard
                    requestId={request.id}
                    hospitalName={request.hospitalName}
                    xrplAddress={request.xrplAddress}
                    amountRequested={request.amountRequested}
                    amountFunded={request.amountFunded}
                    status={request.status}
                    daysOpen={request.daysOpen}
                    isVerified={request.isVerified}
                    patientInfo={request.patientInfo}
                    contributors={request.contributors}
                    onFund={() => {
                      setSelectedRequestId(request.id);
                      setShowDonationModal(true);
                    }}
                    onView={(id) => console.log('View request:', id)}
                  />
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <SlabButton
              variant="ghost"
              size="lg"
              label="View All Requests"
              icon={<ArrowRightIcon className="w-5 h-5" />}
              onClick={() => window.location.href = '/requests'}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-ink mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Simple, transparent, powerful. Three steps to save lives.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Donate',
                description: 'Set up $5 monthly recurring donations or give one-time contributions via Flare or XRPL.',
                icon: CurrencyDollarIcon,
                color: 'bg-accent'
              },
              {
                step: '02',
                title: 'Pool',
                description: 'Your donations join thousands of others in our emergency funding pool, creating massive impact.',
                icon: HeartIcon,
                color: 'bg-accent-2'
              },
              {
                step: '03',
                title: 'Hospital',
                description: 'Verified hospitals create emergency requests and receive instant funding for life-saving treatments.',
                icon: CheckCircleIcon,
                color: 'bg-accent-3'
              }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="slab-container">
                  <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-ink mb-2">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      {user && (
        <section className="py-16 px-4 bg-panel">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-ink mb-4">
                Your Impact
              </h2>
              <p className="text-lg text-muted">
                See how your contributions are making a difference.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Impact Tracker */}
              <div className="lg:col-span-1">
                <ImpactTracker
                  user={user}
                  donations={[
                    { id: 1, amount: 25, date: '2024-01-15', method: 'FLR' },
                    { id: 2, amount: 50, date: '2024-01-10', method: 'USDC' },
                    { id: 3, amount: 15, date: '2024-01-05', method: 'XRPL' },
                    { id: 4, amount: 100, date: '2024-01-01', method: 'FLR' },
                  ]}
                  emergencyRequests={[
                    { id: 1, hospital: 'City General', amount: 500, funded: 500, status: 'completed' },
                    { id: 2, hospital: 'Metro Health', amount: 300, funded: 300, status: 'completed' },
                    { id: 3, hospital: 'Regional Medical', amount: 750, funded: 400, status: 'partial' },
                    { id: 4, hospital: 'Emergency Care', amount: 200, funded: 200, status: 'completed' },
                  ]}
                />
              </div>

              {/* Badge Gallery */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-ink mb-4">Recent Badges</h3>
                <div className="grid grid-cols-3 gap-4">
                  <BadgeComponent
                    badgeType="First Donation"
                    level="bronze"
                    isEarned={true}
                    earnedOn={new Date()}
                  />
                  <BadgeComponent
                    badgeType="Regular Helper"
                    level="silver"
                    progress={75}
                    isEarned={false}
                  />
                  <BadgeComponent
                    badgeType="Life Saver"
                    level="gold"
                    isEarned={true}
                    earnedOn={new Date()}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Donation Modal */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => {
          setShowDonationModal(false);
          setSelectedRequestId(null);
        }}
        requestId={selectedRequestId}
        onSuccess={(result) => {
          console.log('Donation successful:', result);
          // Refresh data after successful donation
          window.location.reload();
        }}
      />
    </div>
  );
};

export default HomePage;
