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
import BadgeComponent from '../components/ui/BadgeComponent';

const HomePage = ({ user, onDonate, onConnectWallet }) => {
  const [poolStats, setPoolStats] = useState({
    totalPool: 0,
    livesHelped: 24300,
    activeRequests: 12
  });
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate API calls
      setTimeout(() => {
        setPoolStats({
          totalPool: 125000,
          livesHelped: 24300,
          activeRequests: 12
        });
        
        setEmergencyRequests([
          {
            id: 'REQ-001',
            hospitalName: 'City General Hospital',
            xrplAddress: 'rCityGeneral123456789',
            amountRequested: 5000,
            amountFunded: 3200,
            status: 'partially_funded',
            daysOpen: 2,
            isVerified: true,
            patientInfo: {
              age: 34,
              condition: 'Emergency Surgery',
              urgency: 'life_threatening',
              estimatedDuration: '2-3 days'
            },
            contributors: 45
          },
          {
            id: 'REQ-002',
            hospitalName: 'Regional Medical Center',
            xrplAddress: 'rRegionalMed987654321',
            amountRequested: 2500,
            amountFunded: 2500,
            status: 'funded',
            daysOpen: 1,
            isVerified: true,
            patientInfo: {
              age: 28,
              condition: 'Trauma Treatment',
              urgency: 'emergency',
              estimatedDuration: '1 week'
            },
            contributors: 67
          },
          {
            id: 'REQ-003',
            hospitalName: 'Community Health Clinic',
            xrplAddress: 'rCommunityHealth456789',
            amountRequested: 1200,
            amountFunded: 800,
            status: 'pending',
            daysOpen: 5,
            isVerified: true,
            patientInfo: {
              age: 45,
              condition: 'Cancer Treatment',
              urgency: 'urgent',
              estimatedDuration: '2 weeks'
            },
            contributors: 23
          }
        ]);
        
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
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
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <div>
                <h1 className="hero-title">
                  Your micro-donations<br />
                  <span className="text-accent">save lives</span>
                </h1>
                <p className="hero-subtitle">
                  Join thousands of donors making $5 monthly contributions that create 
                  massive emergency healthcare funding pools. See your impact in real-time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <SlabButton
                  variant="primary"
                  size="lg"
                  icon={<HeartIcon className="w-5 h-5" />}
                  label="Donate $5 Now"
                  onClick={() => onDonate?.()}
                  className="text-lg px-8 py-4"
                />
                <SlabButton
                  variant="secondary"
                  size="lg"
                  icon={<ClockIcon className="w-5 h-5" />}
                  label="Create Recurring"
                  onClick={() => onConnectWallet?.()}
                  className="text-lg px-8 py-4"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-ink">
                    {poolStats.livesHelped.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted">Lives Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-2">
                    ${poolStats.totalPool.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted">Pool Funded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-3">
                    {poolStats.activeRequests}
                  </div>
                  <div className="text-sm text-muted">Active Requests</div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Pool Slab */}
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="slab-container">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-ink mb-2">
                    Live Emergency Pool
                  </h3>
                  <div className="text-4xl font-bold text-accent-2 mb-2">
                    ${poolStats.totalPool.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted">
                    Available for immediate funding
                  </div>
                </div>

                {/* Animated Ticker */}
                <div className="overflow-hidden bg-white rounded border border-[rgba(11,13,15,0.06)] p-4">
                  <motion.div
                    className="flex space-x-8 text-sm text-muted whitespace-nowrap"
                    variants={tickerVariants}
                    animate="animate"
                  >
                    <span>• Sarah's surgery funded by 23 donors</span>
                    <span>• Emergency treatment completed in Mumbai</span>
                    <span>• $2,500 raised in 4 hours</span>
                    <span>• New donor from XRPL network</span>
                    <span>• Badge earned: Life Saver</span>
                  </motion.div>
                </div>

                {/* Pool Progress */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-muted mb-2">
                    <span>Monthly Goal</span>
                    <span>78%</span>
                  </div>
                  <div className="progress-slab" style={{ '--progress-width': '78%' }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
                  <EmergencyRequestCard
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
                    onFund={() => onDonate?.(request.id)}
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

              {/* Stats */}
              <div className="lg:col-span-2 space-y-4">
                <div className="slab-container">
                  <h3 className="text-xl font-bold text-ink mb-4">Your Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted">Total Donated</span>
                      <span className="font-bold text-ink">$125</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Lives Helped</span>
                      <span className="font-bold text-accent-2">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Badges Earned</span>
                      <span className="font-bold text-accent-3">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
