import React from 'react';
import { motion } from 'framer-motion';
import { 
  GlobeAltIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const DonationGuide = () => {
  const donationMethods = [
    {
      id: 'flr',
      name: 'Flare (FLR)',
      description: 'Native Flare network token - fastest and cheapest',
      icon: GlobeAltIcon,
      color: 'bg-orange-500',
      pros: ['Lowest fees', 'Instant confirmation', 'Native to Flare'],
      cons: ['Requires FLR tokens'],
      howTo: [
        'Connect your MetaMask wallet',
        'Ensure you have FLR tokens',
        'Click "Donate with FLR"',
        'Confirm transaction in wallet'
      ]
    },
    {
      id: 'usdc',
      name: 'USD Coin (USDC)',
      description: 'Stablecoin pegged to US Dollar',
      icon: CurrencyDollarIcon,
      color: 'bg-blue-500',
      pros: ['Stable value', 'Widely accepted', 'No price volatility'],
      cons: ['Requires USDC tokens', 'Higher fees than FLR'],
      howTo: [
        'Connect your MetaMask wallet',
        'Ensure you have USDC tokens',
        'Approve token spending',
        'Confirm donation transaction'
      ]
    },
    {
      id: 'usdt',
      name: 'Tether (USDT)',
      description: 'Popular stablecoin for donations',
      icon: BanknotesIcon,
      color: 'bg-green-500',
      pros: ['Most popular stablecoin', 'High liquidity', 'Stable value'],
      cons: ['Requires USDT tokens', 'Higher fees than FLR'],
      howTo: [
        'Connect your MetaMask wallet',
        'Ensure you have USDT tokens',
        'Approve token spending',
        'Confirm donation transaction'
      ]
    },
    {
      id: 'xrp',
      name: 'XRP (XRPL)',
      description: 'Cross-chain donation via XRPL network',
      icon: GlobeAltIcon,
      color: 'bg-purple-500',
      pros: ['Cross-chain interoperability', 'Fast XRPL network', 'Global reach'],
      cons: ['Requires XRPL wallet', 'Cross-chain complexity'],
      howTo: [
        'Use XRPL wallet (XUMM, etc.)',
        'Send XRP to provided address',
        'Include destination tag',
        'Wait for cross-chain confirmation'
      ]
    },
    {
      id: 'card',
      name: 'Credit Card',
      description: 'Traditional payment method (Coming Soon)',
      icon: CreditCardIcon,
      color: 'bg-gray-500',
      pros: ['Familiar to everyone', 'No crypto knowledge needed', 'Instant processing'],
      cons: ['Higher fees', 'Not yet available', 'Requires KYC'],
      howTo: [
        'Enter card details',
        'Complete 3D Secure verification',
        'Payment processed instantly',
        'Receive confirmation email'
      ]
    }
  ];

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-ink mb-4">
          How to Donate
        </h2>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Choose your preferred payment method. All donations go directly to our emergency healthcare funding pool.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donationMethods.map((method, i) => (
          <motion.div
            key={method.id}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            className="slab-container"
          >
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center`}>
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink">{method.name}</h3>
                <p className="text-sm text-muted">{method.description}</p>
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="space-y-3 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-ink mb-2">Advantages:</h4>
                <ul className="space-y-1">
                  {method.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted">
                      <CheckCircleIcon className="w-4 h-4 text-accent-2 mr-2 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-ink mb-2">Considerations:</h4>
                <ul className="space-y-1">
                  {method.cons.map((con, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted">
                      <div className="w-4 h-4 rounded-full bg-gray-300 mr-2 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* How to Guide */}
            <div>
              <h4 className="text-sm font-semibold text-ink mb-2">How to Donate:</h4>
              <ol className="space-y-2">
                {method.howTo.map((step, idx) => (
                  <li key={idx} className="flex items-start text-sm text-muted">
                    <span className="w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Status Badge */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  method.id === 'card' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-accent-2/10 text-accent-2'
                }`}>
                  {method.id === 'card' ? 'Coming Soon' : 'Available'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <div className="slab-container max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-ink mb-4">
            Why Multiple Payment Methods?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <h4 className="font-semibold text-ink mb-2">Accessibility</h4>
              <p className="text-sm text-muted">
                Everyone can donate using their preferred method, whether they're crypto-native or new to blockchain.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-ink mb-2">Global Reach</h4>
              <p className="text-sm text-muted">
                Different regions prefer different payment methods. We support local preferences worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-ink mb-2">Interoperability</h4>
              <p className="text-sm text-muted">
                Cross-chain donations enable seamless integration between Flare and XRPL networks.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DonationGuide;
