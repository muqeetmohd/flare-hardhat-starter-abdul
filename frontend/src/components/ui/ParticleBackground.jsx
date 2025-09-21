import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = ({ intensity = 'medium' }) => {
  const [particles, setParticles] = useState([]);

  const intensityConfig = {
    low: { count: 20, speed: 0.5, size: 2 },
    medium: { count: 40, speed: 1, size: 3 },
    high: { count: 80, speed: 1.5, size: 4 }
  };

  const config = intensityConfig[intensity] || intensityConfig.medium;

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: config.count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * config.size + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 5,
        color: ['#ff4b3e', '#00b37e', '#1e90ff'][Math.floor(Math.random() * 3)],
        opacity: Math.random() * 0.6 + 0.2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 15000);
    return () => clearInterval(interval);
  }, [config.count]);

  const particleVariants = {
    animate: (particle) => ({
      y: [particle.y, particle.y - 100, particle.y + 50],
      x: [particle.x, particle.x + Math.random() * 20 - 10, particle.x],
      opacity: [0, particle.opacity, 0],
      scale: [0, 1, 0],
      transition: {
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          custom={particle}
          variants={particleVariants}
          animate="animate"
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
