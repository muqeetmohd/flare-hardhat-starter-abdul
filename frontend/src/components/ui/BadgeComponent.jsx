import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { HeartIcon, StarIcon, TrophyIcon, CheckBadgeIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const BadgeComponent = ({
  badgeType,
  level,
  progress = 0,
  earnedOn,
  isEarned = false,
  onClick,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const levelConfig = {
    bronze: {
      color: 'bg-amber-600',
      icon: HeartIcon,
      label: 'Bronze'
    },
    silver: {
      color: 'bg-gray-400',
      icon: StarIcon,
      label: 'Silver'
    },
    gold: {
      color: 'bg-yellow-500',
      icon: TrophyIcon,
      label: 'Gold'
    },
    platinum: {
      color: 'bg-purple-500',
      icon: CheckBadgeIcon,
      label: 'Platinum'
    },
    diamond: {
      color: 'bg-blue-500',
      icon: SparklesIcon,
      label: 'Diamond'
    }
  };

  const badgeInfo = levelConfig[level] || levelConfig.bronze;
  const BadgeIcon = badgeInfo.icon;

  const handleClick = () => {
    if (isEarned && !showConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    onClick?.(badgeType, level);
  };

  const badgeVariants = {
    initial: { scale: 0.7, rotate: 0 },
    animate: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.05, 
      rotate: isEarned ? 5 : 0,
      transition: { duration: 0.22, ease: [0.2, 0.9, 0.25, 1] }
    },
    mint: {
      scale: [0.7, 1.08, 1],
      rotate: [0, 5, 0],
      transition: { duration: 0.36, ease: [0.2, 0.9, 0.25, 1] }
    }
  };

  const confettiVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: { 
      scale: [0, 1, 0],
      rotate: [0, 360, 720],
      y: [0, -20, 100],
      opacity: [1, 1, 0],
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  return (
    <div className="relative">
      <motion.div
        className={clsx(
          'badge-slab group relative overflow-hidden',
          isEarned ? 'cursor-pointer' : 'opacity-50',
          className
        )}
        variants={badgeVariants}
        initial="initial"
        animate={isEarned ? "animate" : "initial"}
        whileHover="hover"
        whileTap={isEarned ? "mint" : undefined}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Badge Icon */}
        <div className={clsx('badge-icon', badgeInfo.color, 'text-white p-3 rounded-full')}>
          <BadgeIcon className="w-8 h-8" />
        </div>

        {/* Badge Level */}
        <div className="badge-level text-ink font-bold">
          {badgeInfo.label}
        </div>

        {/* Progress Ring */}
        {!isEarned && progress > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-accent"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-ink">
              {Math.round(progress)}%
            </span>
          </div>
        )}

        {/* Earned Badge Overlay */}
        {isEarned && (
          <div className="absolute inset-0 bg-accent-2 bg-opacity-10 rounded-md flex items-center justify-center">
            <CheckCircleIcon className="w-6 h-6 text-accent-2" />
          </div>
        )}

        {/* Hover Info Card */}
        <AnimatePresence>
          {isHovered && isEarned && (
            <motion.div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-ink text-white p-3 rounded-md text-xs whitespace-nowrap z-10"
              initial={{ opacity: 0, y: 10, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: 10, rotateX: -90 }}
              transition={{ duration: 0.22, ease: [0.2, 0.9, 0.25, 1] }}
            >
              <div className="font-semibold">{badgeType}</div>
              {earnedOn && (
                <div className="text-muted">Earned {new Date(earnedOn).toLocaleDateString()}</div>
              )}
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-ink absolute top-full left-1/2 transform -translate-x-1/2" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="confetti absolute w-2 h-2"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#FF4B3E', '#00B37E', '#1E90FF', '#2B2F33'][Math.floor(Math.random() * 4)]
                }}
                variants={confettiVariants}
                initial="initial"
                animate="animate"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BadgeComponent;
