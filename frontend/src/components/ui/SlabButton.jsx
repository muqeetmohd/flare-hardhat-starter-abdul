import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const SlabButton = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  onClick,
  className,
  children,
  ...props
}) => {
  const baseClasses = 'btn-slab inline-flex items-center justify-center font-semibold uppercase tracking-tight transition-all duration-140';
  
  const variantClasses = {
    primary: 'bg-accent text-white border-[rgba(11,13,15,0.12)] hover:brightness-105',
    secondary: 'bg-slab text-white border-[rgba(11,13,15,0.12)] hover:brightness-105',
    ghost: 'bg-transparent text-ink border-ink hover:bg-ink hover:text-white',
    success: 'bg-accent-2 text-white border-[rgba(11,13,15,0.12)] hover:brightness-105',
    info: 'bg-accent-3 text-white border-[rgba(11,13,15,0.12)] hover:brightness-105',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    xl: 'px-8 py-5 text-xl',
  };

  const disabledClasses = disabled ? 'opacity-50 pointer-events-none' : '';

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className
  );

  const hoverVariants = {
    hover: {
      y: -2,
      boxShadow: '0 4px 0 0 rgba(11,13,15,0.12)',
      transition: { duration: 0.14, ease: [0.2, 0.9, 0.25, 1] }
    },
    tap: {
      y: 0,
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      variants={hoverVariants}
      whileHover="hover"
      whileTap="tap"
      aria-disabled={disabled}
      role="button"
      {...props}
    >
      {icon && (
        <span className="mr-2 flex-shrink-0">
          {icon}
        </span>
      )}
      {children || label}
    </motion.button>
  );
};

export default SlabButton;
