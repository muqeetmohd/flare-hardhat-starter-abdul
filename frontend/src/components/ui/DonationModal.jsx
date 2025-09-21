import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { 
  XMarkIcon, 
  CurrencyDollarIcon,
  CreditCardIcon,
  BanknotesIcon,
  GlobeAltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import SlabButton from './SlabButton';
import blockchainService from '../../services/blockchainService';

const DonationModal = ({ isOpen, onClose, requestId = null, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('flr');
  const [amount, setAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: method, 2: amount, 3: confirm, 4: success

  const donationMethods = [
    {
      id: 'flr',
      name: 'Flare (FLR)',
      description: 'Native Flare network token',
      icon: GlobeAltIcon,
      color: 'bg-orange-500',
      supported: true,
      minAmount: 0.001,
      maxAmount: 1000
    },
    {
      id: 'usdc',
      name: 'USD Coin (USDC)',
      description: 'Stablecoin for consistent value',
      icon: CurrencyDollarIcon,
      color: 'bg-blue-500',
      supported: true,
      minAmount: 1,
      maxAmount: 10000
    },
    {
      id: 'usdt',
      name: 'Tether (USDT)',
      description: 'Popular stablecoin',
      icon: BanknotesIcon,
      color: 'bg-green-500',
      supported: true,
      minAmount: 1,
      maxAmount: 10000
    },
    {
      id: 'xrp',
      name: 'XRP (XRPL)',
      description: 'Cross-chain via XRPL network',
      icon: GlobeAltIcon,
      color: 'bg-purple-500',
      supported: true,
      minAmount: 1,
      maxAmount: 10000
    },
    {
      id: 'card',
      name: 'Credit Card',
      description: 'Traditional payment method',
      icon: CreditCardIcon,
      color: 'bg-gray-500',
      supported: false, // Would need Stripe integration
      minAmount: 5,
      maxAmount: 1000
    }
  ];

  const quickAmounts = [1, 5, 25, 50, 100, 500];

  const selectedMethodData = donationMethods.find(m => m.id === selectedMethod);

  const handleDonate = async () => {
    if (!selectedMethodData || !selectedMethodData.supported) {
      alert('This payment method is not yet supported');
      return;
    }

    setIsProcessing(true);
    setStep(3);

    try {
      let result;
      const donationAmount = customAmount ? parseFloat(customAmount) : amount;

      switch (selectedMethod) {
        case 'flr':
          result = await blockchainService.makeDonation(
            ethers.parseEther(donationAmount.toString())
          );
          break;
        
        case 'usdc':
        case 'usdt':
          result = await blockchainService.makeTokenDonation(
            selectedMethodData.tokenAddress,
            ethers.parseUnits(donationAmount.toString(), 6) // USDC/USDT have 6 decimals
          );
          break;
        
        case 'xrp':
          result = await blockchainService.makeXrplDonation(
            donationAmount,
            requestId
          );
          break;
        
        case 'card':
          result = await blockchainService.makeCardDonation(
            donationAmount,
            requestId
          );
          break;
        
        default:
          throw new Error('Unsupported payment method');
      }

      if (result.success) {
        setStep(4);
        onSuccess?.(result);
      } else {
        throw new Error(result.error || 'Donation failed');
      }
    } catch (error) {
      console.error('Donation error:', error);
      alert(`Donation failed: ${error.message}`);
      setStep(2);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setAmount(5);
    setCustomAmount('');
    setSelectedMethod('flr');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-ink">
              {step === 1 && 'Choose Payment Method'}
              {step === 2 && 'Enter Amount'}
              {step === 3 && 'Processing...'}
              {step === 4 && 'Success!'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600 mb-6">
                  Select your preferred payment method for donating to emergency healthcare.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {donationMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedMethod(method.id);
                        setStep(2);
                      }}
                      disabled={!method.supported}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        method.supported
                          ? 'border-gray-200 hover:border-accent hover:bg-accent/5'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${method.color} rounded-full flex items-center justify-center`}>
                          <method.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-ink">{method.name}</h3>
                          <p className="text-sm text-gray-500">{method.description}</p>
                          {!method.supported && (
                            <span className="text-xs text-gray-400">Coming Soon</span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-ink mb-4">
                    Donate with {selectedMethodData?.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Enter any amount you want to donate - from $1 to $10,000+. 
                    Every dollar helps fund emergency healthcare.
                  </p>
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quick Amounts
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        onClick={() => {
                          setAmount(quickAmount);
                          setCustomAmount('');
                        }}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          amount === quickAmount
                            ? 'border-accent bg-accent text-white'
                            : 'border-gray-200 hover:border-accent/50'
                        }`}
                      >
                        ${quickAmount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setAmount(0);
                      }}
                      placeholder="Enter amount"
                      min={selectedMethodData?.minAmount || 0}
                      max={selectedMethodData?.maxAmount || 10000}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Min: ${selectedMethodData?.minAmount} | Max: ${selectedMethodData?.maxAmount}
                  </p>
                </div>

                {/* Donation Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Donation Amount:</span>
                    <span className="text-xl font-bold text-ink">
                      ${customAmount || amount} {selectedMethodData?.name}
                    </span>
                  </div>
                  {requestId && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-600">For Request:</span>
                      <span className="text-sm font-medium text-ink">#{requestId}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <SlabButton
                    variant="ghost"
                    label="Back"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  />
                  <SlabButton
                    variant="primary"
                    label="Continue"
                    onClick={handleDonate}
                    disabled={!customAmount && amount === 0}
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <CurrencyDollarIcon className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-ink mb-2">
                  Processing Donation...
                </h3>
                <p className="text-gray-600">
                  Please confirm the transaction in your wallet
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-accent-2 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-2">
                  Donation Successful!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for your contribution to emergency healthcare funding.
                </p>
                <SlabButton
                  variant="primary"
                  label="Close"
                  onClick={handleClose}
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DonationModal;
