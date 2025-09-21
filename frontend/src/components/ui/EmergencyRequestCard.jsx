import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { ClockIcon, HeartIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import SlabButton from './SlabButton';

const EmergencyRequestCard = ({
  requestId,
  hospitalName,
  xrplAddress,
  amountRequested,
  amountFunded,
  status,
  daysOpen,
  isVerified,
  patientInfo,
  priority = 'medium',
  contributors = [],
  onFund,
  onView,
  className,
  ...props
}) => {
  const fundingPercentage = amountRequested > 0 ? (amountFunded / amountRequested) * 100 : 0;
  const isFullyFunded = fundingPercentage >= 100;
  const isPartiallyFunded = fundingPercentage > 0 && fundingPercentage < 100;

  const statusConfig = {
    pending: {
      color: 'bg-muted',
      label: 'Pending',
      icon: ClockIcon
    },
    partially_funded: {
      color: 'bg-accent-3',
      label: 'Partially Funded',
      icon: HeartIcon
    },
    funded: {
      color: 'bg-accent-2',
      label: 'Fully Funded',
      icon: CheckCircleIcon
    },
    disputed: {
      color: 'bg-accent',
      label: 'Disputed',
      icon: ExclamationTriangleIcon
    }
  };

  const priorityConfig = {
    low: 'text-muted',
    medium: 'text-ink',
    high: 'text-accent-3',
    critical: 'text-accent urgent-pulse'
  };

  const currentStatus = isFullyFunded ? 'funded' : isPartiallyFunded ? 'partially_funded' : 'pending';
  const statusInfo = statusConfig[currentStatus];
  const StatusIcon = statusInfo.icon;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -2, transition: { duration: 0.14 } }
  };

  return (
    <motion.article
      className={clsx(
        'card-req group cursor-pointer',
        priorityConfig[priority],
        className
      )}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      role="article"
      aria-labelledby={`request-${requestId}`}
      {...props}
    >
      {/* Status Strip */}
      <div className={clsx('card-strip', statusInfo.color)} />
      
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 
              id={`request-${requestId}`}
              className="text-lg font-bold text-ink truncate"
            >
              {requestId} • {patientInfo?.condition || 'Emergency Treatment'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted">{hospitalName}</span>
              {isVerified && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-accent-2 text-white rounded">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <StatusIcon className="w-4 h-4" />
            <span>{daysOpen}d ago</span>
          </div>
        </div>

        {/* Amount & Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-ink">
              ${amountFunded.toLocaleString()}
            </span>
            <span className="text-sm text-muted">
              of ${amountRequested.toLocaleString()}
            </span>
          </div>
          <div 
            className="progress-slab"
            style={{ '--progress-width': `${Math.min(fundingPercentage, 100)}%` }}
          />
          <div className="flex items-center justify-between mt-1 text-xs text-muted">
            <span>{fundingPercentage.toFixed(1)}% funded</span>
            <span>{contributors.length} donors</span>
          </div>
        </div>

        {/* Patient Info */}
        {patientInfo && (
          <div className="mb-4 p-3 bg-white rounded border border-[rgba(11,13,15,0.06)]">
            <div className="text-sm">
              <span className="font-semibold">Patient:</span> {patientInfo.age}y/o
              {patientInfo.urgency && (
                <span className={clsx('ml-2 px-2 py-1 text-xs font-semibold rounded', {
                  'bg-muted text-white': patientInfo.urgency === 'routine',
                  'bg-accent-3 text-white': patientInfo.urgency === 'urgent',
                  'bg-accent text-white': patientInfo.urgency === 'emergency',
                  'bg-accent urgent-pulse text-white': patientInfo.urgency === 'life_threatening'
                })}>
                  {patientInfo.urgency.replace('_', ' ').toUpperCase()}
                </span>
              )}
            </div>
            {patientInfo.estimatedDuration && (
              <div className="text-xs text-muted mt-1">
                Estimated duration: {patientInfo.estimatedDuration}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlabButton
              variant="primary"
              size="sm"
              label="Fund Now"
              onClick={() => onFund?.(requestId)}
              disabled={isFullyFunded}
            />
            <SlabButton
              variant="ghost"
              size="sm"
              label="View Details"
              onClick={() => onView?.(requestId)}
            />
          </div>
          <div className="text-xs text-muted">
            XRPL: {xrplAddress?.slice(0, 8)}...{xrplAddress?.slice(-4)}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default EmergencyRequestCard;
