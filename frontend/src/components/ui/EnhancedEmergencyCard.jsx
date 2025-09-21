import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import SlabButton from './SlabButton';

const EnhancedEmergencyCard = ({
  requestId,
  hospitalName,
  xrplAddress,
  amountRequested,
  amountFunded,
  status,
  daysOpen,
  isVerified,
  patientInfo,
  contributors,
  onFund,
  onView
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFunding, setIsFunding] = useState(false);

  const progressPercentage = (amountFunded / amountRequested) * 100;
  const isUrgent = patientInfo?.urgency === 'life_threatening';
  const isFullyFunded = status === 'funded';

  const statusConfig = {
    pending: { color: 'bg-yellow-500', text: 'Pending', icon: ClockIcon },
    partially_funded: { color: 'bg-blue-500', text: 'Partially Funded', icon: HeartIcon },
    funded: { color: 'bg-accent-2', text: 'Fully Funded', icon: CheckCircleIcon },
    disputed: { color: 'bg-red-500', text: 'Disputed', icon: ExclamationTriangleIcon }
  };

  const urgencyConfig = {
    life_threatening: { color: 'text-red-600', bg: 'bg-red-100', text: 'Life Threatening' },
    emergency: { color: 'text-orange-600', bg: 'bg-orange-100', text: 'Emergency' },
    urgent: { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Urgent' }
  };

  const currentStatus = statusConfig[status] || statusConfig.pending;
  const currentUrgency = urgencyConfig[patientInfo?.urgency] || urgencyConfig.urgent;

  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
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
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${progressPercentage}%`,
      transition: { duration: 1.5, ease: "easeOut" }
    }
  };

  const handleFund = async () => {
    setIsFunding(true);
    try {
      await onFund();
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="card-req group relative overflow-hidden"
    >
      {/* Status Strip */}
      <div className={`card-strip ${currentStatus.color} relative`}>
        <motion.div
          className="absolute inset-0 bg-white opacity-20"
          animate={{
            scaleY: isHovered ? [1, 1.2, 1] : 1,
            opacity: isHovered ? [0.2, 0.4, 0.2] : 0.2
          }}
          transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <motion.h3
              className="text-lg font-bold text-ink mb-1"
              animate={isHovered ? { x: 5 } : { x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {requestId}
            </motion.h3>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-muted">{hospitalName}</span>
              {isVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center text-accent-2"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">Verified</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Urgency Badge */}
          <motion.div
            className={`px-2 py-1 rounded-full text-xs font-medium ${currentUrgency.bg} ${currentUrgency.color}`}
            animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: isUrgent ? Infinity : 0 }}
          >
            {currentUrgency.text}
          </motion.div>
        </div>

        {/* Patient Info */}
        {patientInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 p-3 rounded-lg"
          >
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted">Age:</span>
                <span className="font-medium ml-1">{patientInfo.age}</span>
              </div>
              <div>
                <span className="text-muted">Condition:</span>
                <span className="font-medium ml-1">{patientInfo.condition}</span>
              </div>
              <div>
                <span className="text-muted">Duration:</span>
                <span className="font-medium ml-1">{patientInfo.estimatedDuration}</span>
              </div>
              <div>
                <span className="text-muted">Days Open:</span>
                <span className="font-medium ml-1">{daysOpen} days</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Amount and Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="w-5 h-5 text-accent-2" />
              <span className="text-2xl font-bold text-ink">
                ${amountFunded.toLocaleString()}
              </span>
              <span className="text-muted">of ${amountRequested.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-accent-2">
                {progressPercentage.toFixed(1)}%
              </div>
              <div className="text-xs text-muted">funded</div>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-2 to-accent-3 rounded-full relative"
              variants={progressVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Contributors and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-muted">
              <UserGroupIcon className="w-4 h-4 mr-1" />
              {contributors} contributors
            </div>
            <div className="flex items-center text-sm">
              <currentStatus.icon className={`w-4 h-4 mr-1 ${currentStatus.color.replace('bg-', 'text-')}`} />
              <span className={currentStatus.color.replace('bg-', 'text-')}>
                {currentStatus.text}
              </span>
            </div>
          </div>

          {/* XRPL Address */}
          <div className="text-xs text-muted font-mono">
            {xrplAddress.slice(0, 8)}...{xrplAddress.slice(-8)}
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex space-x-2 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SlabButton
            variant="primary"
            size="sm"
            label={isFullyFunded ? "View Details" : "Fund Now"}
            icon={isFullyFunded ? ArrowRightIcon : HeartIcon}
            onClick={isFullyFunded ? onView : handleFund}
            disabled={isFunding}
            className="flex-1"
          />
          <SlabButton
            variant="ghost"
            size="sm"
            label="View"
            icon={ArrowRightIcon}
            onClick={() => onView(requestId)}
            className="px-4"
          />
        </motion.div>
      </div>

      {/* Hover Effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent-2/5" />
        <motion.div
          className="absolute top-2 right-2"
          animate={{
            rotate: isHovered ? 360 : 0,
            scale: isHovered ? 1.2 : 1
          }}
          transition={{ duration: 0.6 }}
        >
          <SparklesIcon className="w-6 h-6 text-accent-2" />
        </motion.div>
      </motion.div>

      {/* Urgent Pulsing Effect */}
      {isUrgent && (
        <motion.div
          className="absolute inset-0 border-2 border-red-500 rounded-lg pointer-events-none"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

export default EnhancedEmergencyCard;
