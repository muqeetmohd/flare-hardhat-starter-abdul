import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const AnimatedPool = ({ totalPool, livesHelped, activeRequests }) => {
  const [particles, setParticles] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 8000);
    return () => clearInterval(interval);
  }, []);

  // Trigger animation on value change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [totalPool, livesHelped, activeRequests]);

  const poolVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const numberVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.1, 1],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  const particleVariants = {
    animate: (i) => ({
      y: [0, -30, 0],
      x: [0, Math.random() * 20 - 10, 0],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: i.duration,
        delay: i.delay,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };

  return (
    <motion.div
      variants={poolVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="relative overflow-hidden"
    >
      {/* Main Pool Container */}
      <div className="slab-container pool-pulse relative">
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              custom={particle}
              variants={particleVariants}
              animate="animate"
              className="absolute w-2 h-2 bg-accent-2 rounded-full opacity-60"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`
              }}
            />
          ))}
        </div>

        {/* Pool Header */}
        <div className="text-center mb-6 relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-2"
          >
            <HeartIcon className="w-6 h-6 text-accent mr-2" />
            <h3 className="text-2xl font-bold text-ink">
              Live Emergency Pool
            </h3>
            <SparklesIcon className="w-6 h-6 text-accent-2 ml-2" />
          </motion.div>

          {/* Animated Pool Amount */}
          <motion.div
            variants={numberVariants}
            animate={isAnimating ? "animate" : "initial"}
            className="text-4xl font-bold text-accent-2 mb-2 neon-glow"
            style={{ color: '#00b37e' }}
          >
            ${totalPool.toLocaleString()}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted"
          >
            Available for immediate funding
          </motion.div>
        </div>

        {/* Animated Ticker */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: '-100%' }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="overflow-hidden bg-white rounded border border-[rgba(11,13,15,0.06)] p-4 mb-6"
        >
          <div className="flex space-x-8 text-sm text-muted whitespace-nowrap">
            <span className="flex items-center">
              <HeartIcon className="w-4 h-4 text-accent mr-2" />
              Sarah's surgery funded by 23 donors
            </span>
            <span className="flex items-center">
              <CurrencyDollarIcon className="w-4 h-4 text-accent-2 mr-2" />
              Emergency treatment completed in Mumbai
            </span>
            <span className="flex items-center">
              <ArrowTrendingUpIcon className="w-4 h-4 text-accent-3 mr-2" />
              $2,500 raised in 4 hours
            </span>
            <span className="flex items-center">
              <SparklesIcon className="w-4 h-4 text-purple-500 mr-2" />
              New donor from XRPL network
            </span>
            <span className="flex items-center">
              <HeartIcon className="w-4 h-4 text-accent mr-2" />
              Badge earned: Life Saver
            </span>
          </div>
        </motion.div>

        {/* Animated Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted mb-2">
            <span>Monthly Goal</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              78%
            </motion.span>
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-2 to-accent-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Lives Helped', value: livesHelped, icon: HeartIcon, color: 'text-accent' },
            { label: 'Pool Funded', value: `$${totalPool.toLocaleString()}`, icon: CurrencyDollarIcon, color: 'text-accent-2' },
            { label: 'Active Requests', value: activeRequests, icon: ArrowTrendingUpIcon, color: 'text-accent-3' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-center"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <motion.div
                variants={numberVariants}
                animate={isAnimating ? "animate" : "initial"}
                className={`text-xl font-bold ${stat.color}`}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-10"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, #ff4b3e 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, #00b37e 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, #1e90ff 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, #ff4b3e 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

export default AnimatedPool;
