import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  HeartIcon, 
  ArrowRightIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import SlabButton from './SlabButton';

const AnimatedHero = ({ onDonate, onConnectWallet }) => {
  const [currentText, setCurrentText] = useState(0);
  const controls = useAnimation();

  const heroTexts = [
    "Your donations save lives",
    "Micro-donations, massive impact",
    "Emergency healthcare funding",
    "Cross-chain compassion"
  ];

  const stats = [
    { label: "Lives Helped", value: "24,300", icon: HeartIcon, color: "text-accent" },
    { label: "Pool Funded", value: "$125,000", icon: CurrencyDollarIcon, color: "text-accent-2" },
    { label: "Active Requests", value: "12", icon: ClockIcon, color: "text-accent-3" }
  ];

  // Rotate hero text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Floating particles
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 2,
        duration: Math.random() * 4 + 3
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 10000);
    return () => clearInterval(interval);
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.2, 0.9, 0.25, 1],
        staggerChildren: 0.2
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        delay: 0.4
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.6 + i * 0.1,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.05,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const particleVariants = {
    animate: (i) => ({
      y: [0, -50, 0],
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
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, #ff4b3e 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, #00b37e 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, #1e90ff 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, #ff4b3e 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            custom={particle}
            variants={particleVariants}
            animate="animate"
            className="absolute bg-accent-2 rounded-full opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
          />
        ))}

        {/* Matrix Rain Effect */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              'linear-gradient(90deg, transparent 0%, #00b37e 50%, transparent 100%)',
              'linear-gradient(90deg, transparent 0%, #ff4b3e 50%, transparent 100%)',
              'linear-gradient(90deg, transparent 0%, #1e90ff 50%, transparent 100%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Animated Title */}
            <div className="space-y-4">
              <motion.h1
                variants={textVariants}
                className="hero-title relative"
              >
                <motion.span
                  key={currentText}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="block"
                >
                  {heroTexts[currentText]}
                </motion.span>
                <motion.div
                  className="absolute -top-4 -right-4"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <SparklesIcon className="w-8 h-8 text-accent-2" />
                </motion.div>
              </motion.h1>

              <motion.p
                variants={textVariants}
                className="hero-subtitle text-lg leading-relaxed"
              >
                Donate any amount you want - from $1 to $1000+. Join thousands of donors 
                creating massive emergency healthcare funding pools. See your impact in real-time.
              </motion.p>
            </div>

            {/* Animated Buttons */}
            <motion.div
              variants={textVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <SlabButton
                  variant="primary"
                  size="lg"
                  icon={<HeartIcon className="w-5 h-5" />}
                  label="Donate Any Amount"
                  onClick={onDonate}
                  className="text-lg px-8 py-4 relative overflow-hidden"
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
                </SlabButton>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <SlabButton
                  variant="secondary"
                  size="lg"
                  icon={<ClockIcon className="w-5 h-5" />}
                  label="Create Recurring"
                  onClick={onConnectWallet}
                  className="text-lg px-8 py-4"
                />
              </motion.div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              variants={textVariants}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={statVariants}
                  whileHover="hover"
                  className="text-center cursor-pointer"
                >
                  <motion.div
                    className="flex items-center justify-center mb-2"
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </motion.div>
                  <motion.div
                    className={`text-2xl font-bold ${stat.color} mb-1`}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-muted">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Animated Pool */}
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="relative"
          >
            {/* Pool Container with Morphing */}
            <motion.div
              className="slab-container relative overflow-hidden"
              animate={{
                borderRadius: [
                  "20% 80% 30% 70% / 60% 40% 80% 20%",
                  "80% 20% 70% 30% / 40% 60% 20% 80%",
                  "50% 50% 50% 50% / 50% 50% 50% 50%",
                  "20% 80% 30% 70% / 60% 40% 80% 20%"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Holographic Background */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    'linear-gradient(45deg, #ff4b3e, #00b37e, #1e90ff, #ff4b3e)',
                    'linear-gradient(45deg, #1e90ff, #ff4b3e, #00b37e, #1e90ff)',
                    'linear-gradient(45deg, #00b37e, #1e90ff, #ff4b3e, #00b37e)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Pool Content */}
              <div className="relative z-10 text-center p-8">
                <motion.div
                  className="flex items-center justify-center mb-4"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <GlobeAltIcon className="w-12 h-12 text-accent-2" />
                </motion.div>

                <h3 className="text-2xl font-bold text-ink mb-2">
                  Live Emergency Pool
                </h3>

                <motion.div
                  className="text-4xl font-bold text-accent-2 mb-2"
                  animate={{
                    scale: [1, 1.05, 1],
                    textShadow: [
                      "0 0 10px rgba(0, 179, 126, 0.3)",
                      "0 0 20px rgba(0, 179, 126, 0.6)",
                      "0 0 10px rgba(0, 179, 126, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  $125,000
                </motion.div>

                <div className="text-sm text-muted mb-6">
                  Available for immediate funding
                </div>

                {/* Animated Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted">
                    <span>Monthly Goal</span>
                    <span>78%</span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent-2 to-accent-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedHero;
