import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, SparklesIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const AnimatedLoader = ({ message = "Loading FlareHelp..." }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.2, 0.9, 0.25, 1] 
      }
    }
  };

  const logoVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.2, 0.9, 0.25, 1],
        delay: 0.2
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        delay: 0.6
      }
    }
  };

  const particleVariants = {
    animate: (i) => ({
      y: [0, -30, 0],
      x: [0, Math.random() * 20 - 10, 0],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 2 + Math.random() * 2,
        delay: i * 0.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 2
  }));

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Background */}
        <motion.div
          className="absolute inset-0 opacity-20"
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
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="text-center relative z-10"
      >
        {/* Animated Logo */}
        <motion.div
          variants={logoVariants}
          className="relative mb-8"
        >
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-accent to-accent-2 rounded-2xl flex items-center justify-center mx-auto relative overflow-hidden"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <HeartIcon className="w-12 h-12 text-white" />
            
            {/* Holographic Effect */}
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

          {/* Orbiting Icons */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <SparklesIcon className="w-6 h-6 text-accent-2" />
            </motion.div>
            <motion.div
              className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <GlobeAltIcon className="w-6 h-6 text-accent-3" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          variants={textVariants}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold text-ink mb-2">
            FlareHelp
          </h2>
          <p className="text-lg text-muted">
            {message}{dots}
          </p>
          
          {/* Loading Bar */}
          <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-accent-2 rounded-full"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute -top-10 -left-10 w-20 h-20 bg-accent-2 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-16 h-16 bg-accent-3 rounded-full opacity-20"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>
    </div>
  );
};

export default AnimatedLoader;
