import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  CurrencyDollarIcon,
  TrophyIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import BadgeComponent from '../components/ui/BadgeComponent';
import SlabButton from '../components/ui/SlabButton';

const ImpactPage = ({ user }) => {
  const [impactData, setImpactData] = useState({
    totalDonated: 0,
    totalDonations: 0,
    livesHelped: 0,
    badgesEarned: [],
    recentDonations: [],
    contributedRequests: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImpactData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setImpactData({
          totalDonated: 125,
          totalDonations: 8,
          livesHelped: 3,
          badgesEarned: [
            {
              id: 1,
              badgeType: 'First Donation',
              level: 'bronze',
              isEarned: true,
              earnedOn: new Date('2024-01-15')
            },
            {
              id: 2,
              badgeType: 'Regular Helper',
              level: 'silver',
              isEarned: true,
              earnedOn: new Date('2024-02-10')
            },
            {
              id: 3,
              badgeType: 'Life Saver',
              level: 'gold',
              isEarned: true,
              earnedOn: new Date('2024-03-05')
            },
            {
              id: 4,
              badgeType: 'Emergency Hero',
              level: 'platinum',
              progress: 75,
              isEarned: false
            },
            {
              id: 5,
              badgeType: 'Diamond Donor',
              level: 'diamond',
              progress: 25,
              isEarned: false
            }
          ],
          recentDonations: [
            {
              id: 1,
              amount: 25,
              requestId: 'REQ-001',
              hospitalName: 'City General Hospital',
              patientCondition: 'Emergency Surgery',
              date: new Date('2024-03-15'),
              status: 'completed'
            },
            {
              id: 2,
              amount: 50,
              requestId: 'REQ-002',
              hospitalName: 'Regional Medical Center',
              patientCondition: 'Trauma Treatment',
              date: new Date('2024-03-10'),
              status: 'completed'
            },
            {
              id: 3,
              amount: 15,
              requestId: 'REQ-003',
              hospitalName: 'Community Health Clinic',
              patientCondition: 'Cancer Treatment',
              date: new Date('2024-03-05'),
              status: 'completed'
            }
          ],
          contributedRequests: [
            {
              id: 'REQ-001',
              title: 'Emergency Surgery - Patient Sarah',
              hospitalName: 'City General Hospital',
              amountRequested: 5000,
              amountFunded: 5000,
              status: 'funded',
              patientInfo: {
                age: 34,
                condition: 'Emergency Surgery',
                urgency: 'life_threatening'
              },
              yourContribution: 25,
              totalContributors: 45
            },
            {
              id: 'REQ-002',
              title: 'Trauma Treatment - Patient John',
              hospitalName: 'Regional Medical Center',
              amountRequested: 2500,
              amountFunded: 2500,
              status: 'funded',
              patientInfo: {
                age: 28,
                condition: 'Trauma Treatment',
                urgency: 'emergency'
              },
              yourContribution: 50,
              totalContributors: 67
            }
          ]
        });
        
        setIsLoading(false);
      }, 1000);
    };

    fetchImpactData();
  }, []);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-ink mb-2">Login Required</h2>
          <p className="text-muted mb-6">
            Please connect your wallet to view your impact.
          </p>
          <SlabButton
            variant="primary"
            size="lg"
            label="Connect Wallet"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="py-12 px-4 bg-panel">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-ink mb-4">
              Your Impact
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              See how your contributions are making a real difference in people's lives.
            </p>
          </motion.div>

          {/* Impact Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="slab-container"
            >
              <div className="flex items-center justify-center mb-4">
                <CurrencyDollarIcon className="w-8 h-8 text-accent-2" />
              </div>
              <div className="text-3xl font-bold text-ink mb-2">
                ${impactData.totalDonated}
              </div>
              <div className="text-muted">Total Donated</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="slab-container"
            >
              <div className="flex items-center justify-center mb-4">
                <HeartIcon className="w-8 h-8 text-accent" />
              </div>
              <div className="text-3xl font-bold text-ink mb-2">
                {impactData.livesHelped}
              </div>
              <div className="text-muted">Lives Helped</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="slab-container"
            >
              <div className="flex items-center justify-center mb-4">
                <TrophyIcon className="w-8 h-8 text-accent-3" />
              </div>
              <div className="text-3xl font-bold text-ink mb-2">
                {impactData.badgesEarned.filter(b => b.isEarned).length}
              </div>
              <div className="text-muted">Badges Earned</div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Badge Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="slab-container">
              <h2 className="text-2xl font-bold text-ink mb-6">Your Badges</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {impactData.badgesEarned.map((badge, i) => (
                  <motion.div
                    key={badge.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                  >
                    <BadgeComponent
                      badgeType={badge.badgeType}
                      level={badge.level}
                      progress={badge.progress}
                      isEarned={badge.isEarned}
                      earnedOn={badge.earnedOn}
                      onClick={(type, level) => console.log('Badge clicked:', type, level)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Donations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="slab-container"
            >
              <h2 className="text-2xl font-bold text-ink mb-6">Recent Donations</h2>
              <div className="space-y-4">
                {impactData.recentDonations.map((donation, i) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 bg-white rounded border border-[rgba(11,13,15,0.06)]">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent-2 rounded-full flex items-center justify-center">
                        <HeartIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-ink">{donation.patientCondition}</div>
                        <div className="text-sm text-muted">{donation.hospitalName}</div>
                        <div className="text-xs text-muted">{donation.date.toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-accent-2">${donation.amount}</div>
                      <div className="text-xs text-muted">{donation.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contributed Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div className="slab-container">
              <h2 className="text-2xl font-bold text-ink mb-6">Requests You've Helped Fund</h2>
              <div className="space-y-4">
                {impactData.contributedRequests.map((request, i) => (
                  <motion.div
                    key={request.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="p-4 bg-white rounded border border-[rgba(11,13,15,0.06)]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-ink">{request.title}</h3>
                        <p className="text-sm text-muted">{request.hospitalName}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        request.status === 'funded' ? 'bg-accent-2 text-white' : 'bg-muted text-white'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-muted mb-1">
                        <span>Funding Progress</span>
                        <span>{Math.round((request.amountFunded / request.amountRequested) * 100)}%</span>
                      </div>
                      <div 
                        className="progress-slab"
                        style={{ '--progress-width': `${(request.amountFunded / request.amountRequested) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-muted">
                          Your contribution: <span className="font-semibold text-accent-2">${request.yourContribution}</span>
                        </span>
                        <span className="text-muted">
                          {request.totalContributors} donors
                        </span>
                      </div>
                      <div className="text-muted">
                        ${request.amountFunded.toLocaleString()} / ${request.amountRequested.toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Impact Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="slab-container"
            >
              <h2 className="text-2xl font-bold text-ink mb-6">Impact Timeline</h2>
              <div className="space-y-4">
                {[
                  {
                    date: 'March 15, 2024',
                    event: 'Helped fund Sarah\'s emergency surgery',
                    impact: 'Life saved',
                    amount: 25
                  },
                  {
                    date: 'March 10, 2024',
                    event: 'Contributed to John\'s trauma treatment',
                    impact: 'Recovery supported',
                    amount: 50
                  },
                  {
                    date: 'March 5, 2024',
                    event: 'Supported cancer treatment fund',
                    impact: 'Hope provided',
                    amount: 15
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4 p-3 bg-white rounded border border-[rgba(11,13,15,0.06)]">
                    <div className="w-3 h-3 bg-accent-2 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-ink">{item.event}</div>
                      <div className="text-sm text-muted">{item.impact} • ${item.amount} donated</div>
                      <div className="text-xs text-muted">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ImpactPage;
