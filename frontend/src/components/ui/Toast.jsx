import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Toast = ({
  id,
  type = 'info',
  title,
  message,
  action,
  onClose,
  duration = 5000,
  className
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircleIcon,
      color: 'bg-accent-2',
      textColor: 'text-accent-2'
    },
    error: {
      icon: ExclamationTriangleIcon,
      color: 'bg-accent',
      textColor: 'text-accent'
    },
    info: {
      icon: InformationCircleIcon,
      color: 'bg-accent-3',
      textColor: 'text-accent-3'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  const toastVariants = {
    initial: { 
      opacity: 0, 
      x: 300, 
      scale: 0.8,
      transition: { duration: 0.16 }
    },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        duration: 0.22, 
        ease: [0.2, 0.9, 0.25, 1] 
      }
    },
    exit: { 
      opacity: 0, 
      x: 300, 
      scale: 0.8,
      transition: { duration: 0.16 }
    }
  };

  return (
    <motion.div
      className={clsx(
        'toast-slab relative overflow-hidden',
        className
      )}
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      {/* Left Accent Strip */}
      <div className={clsx('toast-strip', config.color)} />
      
      {/* Content */}
      <div className="flex items-start space-x-3 pl-6">
        <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', config.textColor)} />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-semibold text-ink mb-1">
              {title}
            </h4>
          )}
          <p className="text-sm text-muted">
            {message}
          </p>
          {action && (
            <div className="mt-2">
              <button
                onClick={action.onClick}
                className="text-sm font-medium text-accent hover:text-accent-2 transition-colors"
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => onClose?.(id)}
          className="flex-shrink-0 p-1 text-muted hover:text-ink transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
export { ToastContainer };
